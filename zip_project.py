import os
import zipfile
from pathlib import Path
from datetime import datetime
import argparse

def zip_project(project_dir=".", only_src=False):
    project_dir = Path(project_dir).resolve()

    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    if only_src:
        zip_path = project_dir / f"{project_dir.name}-src-{ts}.zip"
        base_dir = project_dir / "src"
    else:
        zip_path = project_dir / f"{project_dir.name}-{ts}.zip"
        base_dir = project_dir

    # Things to skip (only for full project)
    exclude_dirs = {".git", "node_modules", "dist", ".firebase", ".idea", ".vscode", "__pycache__"}
    exclude_files = {".env", ".DS_Store", "Thumbs.db"}
    exclude_exts = {".log", ".zip"}  # skip logs/zips

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(base_dir, topdown=True):
            if not only_src:
                dirs[:] = [d for d in dirs if d not in exclude_dirs]

            for fname in files:
                if fname in exclude_files:
                    continue
                fpath = Path(root) / fname
                if fpath == zip_path:
                    continue
                if fpath.suffix.lower() in exclude_exts:
                    continue

                relpath = fpath.relative_to(project_dir)
                zf.write(fpath, relpath)

    print(f"✅ Zipped {'src only' if only_src else 'whole project'} to: {zip_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Zip project or just src folder")
    parser.add_argument(
        "--src",
        action="store_true",
        help="Only zip the src folder instead of the whole project"
    )
    args = parser.parse_args()

    zip_project(".", only_src=args.src)
