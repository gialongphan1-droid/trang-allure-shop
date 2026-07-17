// frontend/src/hooks/useDraft.js
import { useState, useEffect } from 'react';

/**
 * Hook lưu trữ dữ liệu tạm thời trong localStorage
 * @param {string} key - Key để lưu trong localStorage
 * @param {any} initialData - Dữ liệu ban đầu
 * @returns {[data, setData, clearDraft]}
 */
export function useDraft(key, initialData) {
  // Load dữ liệu từ localStorage khi khởi tạo
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge với initialData để đảm bảo đủ fields
        return { ...initialData, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load draft:', error);
    }
    return initialData;
  });

  // Tự động lưu vào localStorage mỗi khi data thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save draft:', error);
    }
  }, [key, data]);

  // Xóa draft
  const clearDraft = () => {
    localStorage.removeItem(key);
    setData(initialData);
  };

  return [data, setData, clearDraft];
}