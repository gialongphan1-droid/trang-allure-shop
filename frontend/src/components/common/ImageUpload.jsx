import { Upload, X, Plus } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { optimizeProduct } from "@/utils/imageUtils";

const ImageUpload = ({ 
  value = [], 
  onChange, 
  multiple = true, 
  maxFiles = 0, // ✅ 0 = không giới hạn
  disabled = false 
}) => {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);

  // ✅ Cập nhật previews khi value thay đổi từ bên ngoài
  useEffect(() => {
    if (value && value.length > 0) {
      const newPreviews = value.map(item => {
        if (typeof item === 'string') {
          return item;
        }
        if (item.preview) {
          return item.preview;
        }
        if (item instanceof File) {
          return URL.createObjectURL(item);
        }
        return item;
      });
      setPreviews(newPreviews);
    } else {
      setPreviews([]);
    }
  }, [value]);

  // ✅ Xử lý khi thả file
  const onDrop = useCallback(
    async (acceptedFiles) => {
      // ✅ Kiểm tra nếu không cho phép multiple
      if (!multiple && acceptedFiles.length > 1) {
        alert("Chỉ được chọn 1 ảnh");
        return;
      }

      // ✅ Nếu maxFiles > 0 thì kiểm tra giới hạn
      if (maxFiles > 0 && value.length + acceptedFiles.length > maxFiles) {
        alert(`Chỉ được tối đa ${maxFiles} ảnh`);
        return;
      }

      setUploading(true);
      try {
        // ✅ Tạo danh sách file mới
        const newFiles = acceptedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));

        // ✅ Cập nhật previews
        const newPreviews = [...previews, ...newFiles.map((f) => f.preview)];
        setPreviews(newPreviews);

        // ✅ Gọi onChange với danh sách file mới
        const currentValue = value || [];
        const newValue = [...currentValue, ...newFiles.map((f) => f.file)];
        onChange(newValue);
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setUploading(false);
      }
    },
    [value, multiple, maxFiles, onChange, previews]
  );

  // ✅ Xóa ảnh theo index
  const removeImage = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newValue = value.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onChange(newValue);
  };

  // ✅ Xóa tất cả ảnh
  const clearAllImages = () => {
    setPreviews([]);
    onChange([]);
  };

  // ✅ Tính số lượng ảnh có thể thêm
  const getRemainingSlots = () => {
    if (maxFiles === 0) return Infinity;
    return Math.max(0, maxFiles - (value?.length || 0));
  };

  const remainingSlots = getRemainingSlots();
  const isFull = maxFiles > 0 && remainingSlots <= 0;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"],
    },
    multiple,
    maxFiles: maxFiles === 0 ? undefined : remainingSlots,
    disabled: uploading || isFull || disabled,
  });

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${
            isDragActive
              ? "border-brand-primary bg-brand-primary/5"
              : isFull
              ? "border-gray-300 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 hover:border-brand-primary/50 hover:bg-muted/30"
          }
          ${uploading ? "opacity-50 cursor-not-allowed" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className={`
            p-4 rounded-full transition-all duration-200
            ${isDragActive 
              ? "bg-brand-primary/20" 
              : isFull 
              ? "bg-gray-200" 
              : "bg-brand-primary/10"
            }
          `}>
            {uploading ? (
              <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
            ) : (
              <Upload className={`
                w-8 h-8 
                ${isDragActive 
                  ? "text-brand-primary" 
                  : isFull 
                  ? "text-gray-400" 
                  : "text-brand-primary/70"
                }
              `} />
            )}
          </div>
          
          {uploading ? (
            <p className="text-gray-500">Đang tải lên...</p>
          ) : isFull ? (
            <p className="text-gray-500">Đã đạt giới hạn {maxFiles} ảnh</p>
          ) : (
            <>
              <p className="text-gray-600 font-medium">
                {isDragActive
                  ? "✨ Thả ảnh vào đây"
                  : "📁 Kéo thả ảnh vào đây hoặc click để chọn"}
              </p>
              <p className="text-sm text-gray-400">
                {multiple
                  ? maxFiles === 0
                    ? `Không giới hạn số lượng ảnh (${value?.length || 0} ảnh đã tải lên)`
                    : `Tối đa ${maxFiles} ảnh (còn ${remainingSlots} ảnh)`
                  : "Chỉ chọn 1 ảnh"}
              </p>
              <p className="text-xs text-gray-400">
                Định dạng: PNG, JPG, JPEG, WEBP, GIF, SVG
              </p>
            </>
          )}
        </div>
      </div>

      {/* Preview Images */}
      {previews.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              Ảnh đã tải lên ({previews.length})
            </p>
            {previews.length > 1 && (
              <button
                type="button"
                onClick={clearAllImages}
                className="text-sm text-red-500 hover:text-red-600 transition-colors"
              >
                Xóa tất cả
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={typeof preview === "string" ? optimizeProduct(preview) : preview}
                  alt={`Ảnh ${index + 1}`}
                  className="object-cover w-full aspect-square rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-xs rounded">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;