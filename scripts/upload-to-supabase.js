const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Baca .env.local secara manual
const envPath = path.join(__dirname, '..', '.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const matchUrl = line.match(/^NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)$/);
    if (matchUrl) supabaseUrl = matchUrl[1].trim();
    const matchKey = line.match(/^NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.*)$/);
    if (matchKey) supabaseAnonKey = matchKey[1].trim();
    const matchService = line.match(/^SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.*)$/);
    if (matchService) serviceRoleKey = matchService[1].trim();
  });
}

if (!supabaseUrl || (!supabaseAnonKey && !serviceRoleKey)) {
  console.error("❌ Error: SUPABASE_URL atau SUPABASE_ANON_KEY tidak ditemukan di .env.local!");
  process.exit(1);
}

// Gunakan Service Role Key jika ada untuk bypass RLS & Auto-create bucket
const keyToUse = serviceRoleKey || supabaseAnonKey;
const supabase = createClient(supabaseUrl, keyToUse);

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
};

async function ensureBucket(bucketName) {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets && buckets.some((b) => b.name === bucketName);
    if (!exists) {
      console.log(`Mengaktifkan/membuat bucket '${bucketName}'...`);
      await supabase.storage.createBucket(bucketName, { public: true });
    }
  } catch (e) {
    // Abaikan jika bucket sudah ada atau diatur di Dashboard
  }
}

async function uploadDirectory(dirPath, bucketName) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Direktori ${dirPath} tidak ditemukan, skip.`);
    return {};
  }

  await ensureBucket(bucketName);

  const files = fs.readdirSync(dirPath);
  const urlMapping = {};
  let failCount = 0;

  console.log(`\n=== Memulai Upload untuk Bucket '${bucketName}' (${files.length} file) ===`);

  for (const file of files) {
    if (file.startsWith('.')) continue; // skip .gitkeep dll

    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) continue;

    const ext = path.extname(file).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileBuffer = fs.readFileSync(filePath);

    // Sanitasi nama file di Supabase
    const sanitizedFileName = file.replace(/[^a-zA-Z0-9.\-_]/g, '_');

    console.log(`Uploading: ${file} -> bucket '${bucketName}'...`);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(sanitizedFileName, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      failCount++;
      console.error(`  ❌ Gagal upload ${file}: ${error.message}`);
    } else {
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(sanitizedFileName);

      urlMapping[file] = publicUrlData.publicUrl;
      console.log(`  ✅ Berhasil: ${publicUrlData.publicUrl}`);
    }
  }

  if (failCount > 0) {
    console.log(`\n⚠️ ${failCount} file gagal di-upload ke bucket '${bucketName}'.`);
    console.log(`Penyebab utama: Bucket '${bucketName}' belum dibuat secara Public di Supabase Dashboard ATAU Kebijakan RLS memblokir upload anonim.`);
  }

  return urlMapping;
}

async function main() {
  console.log("🚀 Starting Supabase Media & Document Migration...");
  console.log(`URL: ${supabaseUrl}`);
  if (serviceRoleKey) {
    console.log("🔑 Menggunakan SUPABASE_SERVICE_ROLE_KEY (Full Access Admin Mode)");
  } else {
    console.log("🔑 Menggunakan Anon Key (Standard Mode)");
  }

  const imageDir = path.join(__dirname, '..', 'public', 'image');
  const docDir = path.join(__dirname, '..', 'public', 'dokumen');

  const imageUrls = await uploadDirectory(imageDir, 'images');
  const docUrls = await uploadDirectory(docDir, 'dokumen');

  console.log("\n=======================================================");
  console.log("🎉 MIGRATION PROCESS FINISHED!");
  console.log("=======================================================");
  console.log(`Total Gambar Ter-upload: ${Object.keys(imageUrls).length}`);
  console.log(`Total Dokumen Ter-upload: ${Object.keys(docUrls).length}`);
}

main();

