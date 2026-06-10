import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';

export async function POST(req) {
  try {
    const session = getSession(req);
    if (!session || !['owner', 'manager'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No files received.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    const fileUri = `data:${file.type};base64,${base64Data}`;

    const cloudName = process.env.CLOUDINARY_NAME;
    const apiKey = process.env.CLOUDINARY_API;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary credentials missing' }, { status: 500 });
    }

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const timestamp = Math.round((new Date).getTime() / 1000);
    
    // Calculate signature using crypto
    const signature = crypto.createHash('sha1').update(`timestamp=${timestamp}${apiSecret}`).digest('hex');

    const uploadFormData = new FormData();
    uploadFormData.append('file', fileUri);
    uploadFormData.append('api_key', apiKey);
    uploadFormData.append('timestamp', timestamp);
    uploadFormData.append('signature', signature);
    // Optional: add a folder
    uploadFormData.append('folder', `turbin-web/spots/${session.tenant_id}`);

    // Must re-calculate signature if we add folder, so let's just upload to root or calculate with folder.
    // Actually, if we add 'folder' to the form data, it must be included in the signature calculation, sorted alphabetically:
    // folder=...&timestamp=...<secret>
    const strToSign = `folder=turbin-web/spots/${session.tenant_id}&timestamp=${timestamp}${apiSecret}`;
    const newSignature = crypto.createHash('sha1').update(strToSign).digest('hex');
    
    uploadFormData.set('signature', newSignature);

    const res = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: uploadFormData
    });

    const data = await res.json();
    if (data.secure_url) {
      return NextResponse.json({ image_url: data.secure_url, image_id: data.public_id });
    } else {
      console.error('Cloudinary Error:', data);
      return NextResponse.json({ error: data.error?.message || 'Upload failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
