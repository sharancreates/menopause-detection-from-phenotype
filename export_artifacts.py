#!/usr/bin/env python3
"""
CLI entry point to extract, fit, and export MenoPhenotype model artifacts.
Usage:
    python export_artifacts.py
    python export_artifacts.py --data data/28762-0001-Data.csv --output artifacts
"""

import argparse
import sys
from pathlib import Path

# Ensure menophenotype is importable from root
sys.path.insert(0, str(Path(__file__).resolve().parent))

from menophenotype.export import train_and_export


def main():
    parser = argparse.ArgumentParser(
        description="Extract and export MenoPhenotype ML model artifacts from SWAN dataset."
    )
    parser.add_argument(
        "--data",
        type=str,
        default="data/28762-0001-Data.csv",
        help="Path to raw SWAN baseline CSV (default: data/28762-0001-Data.csv)"
    )
    parser.add_argument(
        "--output",
        type=str,
        default="artifacts",
        help="Output directory to save model and metadata artifacts (default: artifacts)"
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Random seed for reproducibility (default: 42)"
    )

    args = parser.parse_args()

    data_file = Path(args.data)
    out_dir = Path(args.output)

    print(f"=== MenoPhenotype Artifact Exporter ===")
    print(f"Dataset path: {data_file}")
    print(f"Output directory: {out_dir}")

    if not data_file.exists():
        print(f"\n[!] Dataset file not found at '{data_file}'!")
        print("Please ensure the SWAN Baseline dataset '28762-0001-Data.csv' is placed inside 'data/' directory.")
        sys.exit(1)

    result = train_and_export(data_path=data_file, output_dir=out_dir, random_state=args.seed)
    print("\n[OK] Export complete! Artifacts summary:")
    for f in sorted(out_dir.glob("*")):
        print(f"  - {f.name} ({f.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
