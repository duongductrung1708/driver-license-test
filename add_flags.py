import argparse
import json
import os
import sys
from typing import Any, Dict, List, Tuple


CATEGORY = {
    "KHAI_NIEM_QUY_TAC": "Khái Niệm & Quy Tắc",
    "VAN_HOA_GIAO_THONG": "Văn Hóa Giao Thông",
    "KY_THUAT_LAI_XE": "Kỹ Thuật Lái Xe",
    "SA_HINH": "Sa Hình",
    "BIEN_BAO": "Biển Báo",
}


def has_any(text: str, keywords: List[str]) -> bool:
    if not text:
        return False
    lower = text.lower()
    return any(kw.lower() in lower for kw in keywords)


def infer_category(question: Dict[str, Any]) -> str:
    # Priority 1: boolean flags already present
    if question.get("isTrafficSign"):
        return CATEGORY["BIEN_BAO"]
    if question.get("isSaHinh"):
        return CATEGORY["SA_HINH"]
    if question.get("isKhaiNiemQuyTac"):
        return CATEGORY["KHAI_NIEM_QUY_TAC"]
    if question.get("isVanHoaGiaoThong"):
        return CATEGORY["VAN_HOA_GIAO_THONG"]
    if question.get("isKyThuatLaiXe"):
        return CATEGORY["KY_THUAT_LAI_XE"]

    # Priority 2: explicit category string if valid
    cat = question.get("category")
    if cat in CATEGORY.values():
        return cat

    # Priority 3: heuristics
    text = " \n ".join(
        [str(question.get("question", "")), str(question.get("explanation", ""))]
    )

    if question.get("image") or has_any(
        text,
        [
            "sa hình",
            "hình dưới",
            "trong hình",
            "theo hướng",
            "giao nhau",
            "thứ tự",
            "nhường đường",
            "làn đường",
            "rẽ trái",
            "rẽ phải",
            "quay đầu",
        ],
    ):
        if question.get("image") or has_any(text, ["hình", "giao nhau", "thứ tự"]):
            return CATEGORY["SA_HINH"]

    if has_any(
        text,
        [
            "văn hóa",
            "còi",
            "rượu",
            "bia",
            "nồng độ cồn",
            "đạo đức",
            "hành vi",
            "ứng xử",
            "an toàn",
            "văn minh",
        ],
    ):
        return CATEGORY["VAN_HOA_GIAO_THONG"]

    if has_any(
        text,
        [
            "kỹ thuật",
            "kỹ năng",
            "vào số",
            "phanh",
            "ga",
            "vào cua",
            "tăng số",
            "giảm số",
            "khởi hành",
            "đổ đèo",
            "quãng đường",
            "rẽ",
        ],
    ):
        return CATEGORY["KY_THUAT_LAI_XE"]

    if has_any(
        text,
        [
            "quy tắc",
            "khái niệm",
            "bị cấm",
            "được phép",
            "phải",
            "không được",
            "ưu tiên",
            "đường sắt",
            "làn đường",
            "biển cấm",
            "tốc độ",
        ],
    ):
        return CATEGORY["KHAI_NIEM_QUY_TAC"]

    return CATEGORY["KHAI_NIEM_QUY_TAC"]


def load_json(path: str) -> List[Dict[str, Any]]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path: str, data: List[Dict[str, Any]]) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def backup(path: str) -> str:
    base, ext = os.path.splitext(path)
    backup_path = f"{base}.backup_flags{ext}"
    with open(path, "r", encoding="utf-8") as src, open(
        backup_path, "w", encoding="utf-8"
    ) as dst:
        dst.write(src.read())
    return backup_path


def assign_flags(
    questions: List[Dict[str, Any]],
    *,
    only_missing: bool,
    force: bool,
) -> Tuple[List[Dict[str, Any]], Dict[str, int]]:
    stats = {
        "isKhaiNiemQuyTac": 0,
        "isVanHoaGiaoThong": 0,
        "isKyThuatLaiXe": 0,
        "isSaHinh": 0,
    }

    for q in questions:
        cat = infer_category(q)

        # Determine desired flag mapping
        desired = {
            "isKhaiNiemQuyTac": cat == CATEGORY["KHAI_NIEM_QUY_TAC"],
            "isVanHoaGiaoThong": cat == CATEGORY["VAN_HOA_GIAO_THONG"],
            "isKyThuatLaiXe": cat == CATEGORY["KY_THUAT_LAI_XE"],
            "isSaHinh": cat == CATEGORY["SA_HINH"],
        }

        for key, value in desired.items():
            current = q.get(key)
            if only_missing and isinstance(current, bool):
                # Keep existing boolean as-is
                pass
            else:
                if force or not isinstance(current, bool):
                    q[key] = value

            if isinstance(q.get(key), bool) and q[key]:
                stats[key] += 1

    return questions, stats


def parse_args(argv: List[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Add boolean flags (isKhaiNiemQuyTac, isVanHoaGiaoThong, "
            "isKyThuatLaiXe, isSaHinh) into questions.json based on category/heuristics."
        )
    )
    parser.add_argument(
        "--path",
        default="src/data/questions.json",
        help="Path to questions JSON (default: src/data/questions.json)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing boolean flags if present",
    )
    parser.add_argument(
        "--only-missing",
        action="store_true",
        help="Only set flags where missing or invalid",
    )
    parser.add_argument(
        "--no-backup",
        action="store_true",
        help="Do not create a backup *.backup_flags.json file",
    )
    return parser.parse_args(argv)


def main(argv: List[str]) -> int:
    args = parse_args(argv)
    path = args.path

    if not os.path.exists(path):
        print(f"File not found: {path}", file=sys.stderr)
        return 1

    if not args.no_backup:
        backup_path = backup(path)
        print(f"Backup written: {backup_path}")

    questions = load_json(path)
    updated, stats = assign_flags(
        questions, only_missing=args.only_missing, force=args.force
    )
    save_json(path, updated)

    print("Flags assigned (true counts):")
    total_true = 0
    for k in [
        "isKhaiNiemQuyTac",
        "isVanHoaGiaoThong",
        "isKyThuatLaiXe",
        "isSaHinh",
    ]:
        c = stats.get(k, 0)
        total_true += c
        print(f"- {k}: {c}")
    print(f"Total true flags: {total_true}")

    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))


