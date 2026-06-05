import type { RecordFormData, FormErrors } from '../types';

export const validateRecordForm = (data: Partial<RecordFormData>): FormErrors => {
  const errors: FormErrors = {};

  if (!data.title || data.title.trim().length === 0) {
    errors.title = '请输入标题';
  } else if (data.title.length > 100) {
    errors.title = '标题不能超过100字';
  }

  if (!data.type) {
    errors.type = '请选择类型';
  }

  if (data.coverUrl && data.coverUrl.trim()) {
    try {
      new URL(data.coverUrl);
    } catch {
      errors.coverUrl = '请输入有效的图片URL';
    }
  }

  if (data.year !== undefined && data.year !== null) {
    const yearNum = Number(data.year);
    if (isNaN(yearNum) || !Number.isInteger(yearNum) || yearNum < 1900 || yearNum > 2100) {
      errors.year = '请输入有效的年份（1900-2100）';
    }
  }

  if (data.description && data.description.length > 500) {
    errors.description = '简介不能超过500字';
  }

  return errors;
};

export const validateRating = (rating: number): string | undefined => {
  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return '请选择1-5星评分';
  }
  return undefined;
};

export const validateReview = (review: string): string | undefined => {
  if (review.length > 200) {
    return '短评不能超过200字';
  }
  return undefined;
};

export const hasErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0;
};
