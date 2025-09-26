export const CATEGORY = {
  KHAI_NIEM_QUY_TAC: "Khái Niệm & Quy Tắc",
  VAN_HOA_GIAO_THONG: "Văn Hóa Giao Thông",
  KY_THUAT_LAI_XE: "Kỹ Thuật Lái Xe",
  SA_HINH: "Sa Hình",
  BIEN_BAO: "Biển Báo",
};

function hasAny(text, keywords) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

// Heuristics based on existing fields and Vietnamese keywords
export function inferCategory(questionObj) {
  // Prefer boolean flags first (like isTrafficSign style)
  if (questionObj.isTrafficSign) return CATEGORY.BIEN_BAO;
  if (questionObj.isSaHinh) return CATEGORY.SA_HINH;
  if (questionObj.isKhaiNiemQuyTac) return CATEGORY.KHAI_NIEM_QUY_TAC;
  if (questionObj.isVanHoaGiaoThong) return CATEGORY.VAN_HOA_GIAO_THONG;
  if (questionObj.isKyThuatLaiXe) return CATEGORY.KY_THUAT_LAI_XE;

  // Then prefer explicit category if present
  if (questionObj.category && Object.values(CATEGORY).includes(questionObj.category)) {
    return questionObj.category;
  }

  const text = [questionObj.question, questionObj.explanation]
    .filter(Boolean)
    .join(" \n ");

  // Sa Hình: often contains images with intersections, priority, turning, lane order
  if (
    questionObj.image ||
    hasAny(text, [
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
    ])
  ) {
    // But avoid classifying obvious law-only text without image as Sa Hình
    if (questionObj.image || hasAny(text, ["hình", "giao nhau", "thứ tự"])) {
      return CATEGORY.SA_HINH;
    }
  }

  // Văn Hóa Giao Thông: etiquette, behavior, alcohol, horn usage, community
  if (
    hasAny(text, [
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
    ])
  ) {
    return CATEGORY.VAN_HOA_GIAO_THONG;
  }

  // Kỹ Thuật Lái Xe: technical handling, gears, braking, driving technique
  if (
    hasAny(text, [
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
    ])
  ) {
    return CATEGORY.KY_THUAT_LAI_XE;
  }

  // Khái Niệm & Quy Tắc: default for law/rules, prohibitions, definitions
  if (
    hasAny(text, [
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
    ])
  ) {
    return CATEGORY.KHAI_NIEM_QUY_TAC;
  }

  // Fallback
  return CATEGORY.KHAI_NIEM_QUY_TAC;
}

export function getQuestionWithCategory(questionObj) {
  return { ...questionObj, category: inferCategory(questionObj) };
}

export function groupByCategory(questions) {
  return questions.reduce((acc, q) => {
    const cat = inferCategory(q);
    acc[cat] = acc[cat] || [];
    acc[cat].push(q);
    return acc;
  }, {});
}
