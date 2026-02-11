import { promises as fs } from "fs";
import { spawn } from "child_process";
import path from "path";
import os from "os";

function run(cmd: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args);
    let out = "";
    let err = "";

    p.stdout.on("data", (d) => (out += d.toString()));
    p.stderr.on("data", (d) => (err += d.toString()));

    p.on("error", reject);
    p.on("close", (code) => {
      if (code === 0) return resolve(out.trim());
      reject(new Error(`${cmd} failed (code ${code}): ${err.trim()}`));
    });
  });
}

/**
 * Writes a buffer to a temp file and returns the file path.
 */
export async function writeTempFile(buffer: Buffer, filename: string): Promise<string> {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const tempPath = path.join(os.tmpdir(), `${Date.now()}-${safeName}`);
  await fs.writeFile(tempPath, buffer);
  return tempPath;
}

export async function getDurationSeconds(inputPath: string): Promise<number> {
  // ffprobe returns duration in seconds (string)
  const out = await run("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    inputPath,
  ]);

  const seconds = Number(out);
  return Number.isFinite(seconds) ? Math.round(seconds) : 0;
}

export async function generateThumbnail(inputPath: string): Promise<string> {
  // Create thumbnail jpg in /tmp
  const thumbPath = path.join(os.tmpdir(), `thumb-${Date.now()}.jpg`);

  // Grab frame at ~1 second, scale to 640 width while preserving aspect
  await run("ffmpeg", [
    "-y",
    "-ss", "1",
    "-i", inputPath,
    "-vframes", "1",
    "-vf", "scale=640:-2",
    "-q:v", "4",
    thumbPath,
  ]);

  return thumbPath;
}

export async function cleanupFiles(paths: string[]) {
  await Promise.all(
    paths.map(async (p) => {
      try { await fs.unlink(p); } catch { /* ignore */ }
    })
  );
}
