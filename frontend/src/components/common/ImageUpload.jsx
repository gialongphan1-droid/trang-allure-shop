import { Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { optimizeProduct } from "@/utils/imageUtils";

const ImageUpload = ({ value = [], onChange, multiple = true, maxFiles = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState(value || []);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!multiple && acceptedFiles.length > 1) {
        alert("Chỉ được chọn 1 ảnh");
        return;
      }

      if (value.length + acceptedFiles.length > maxFiles) {
        alert(`Chỉ được tối đa ${maxFiles} ảnh`);
        return;
      }

      setUploading(true);
      try {
        const newFiles = acceptedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));
        const newPreviews = [...previews, ...newFiles.map((f) => f.preview)];
        setPreviews(newPreviews);
        onChange([...value, ...newFiles.map((f) => f.file)]);
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setUploading(false);
      }
    },
    [value, multiple, maxFiles, onChange, previews]
  );

  const removeImage = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newValue = value.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onChange(newValue);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
    },
    multiple,
    maxFiles: maxFiles - value.length,
    disabled: uploading || value.length >= maxFiles,
  });

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition
          ${
            isDragActive
              ? "border-brand-primary bg-brand-background"
              : "border-gray-300 hover:border-brand-primary"
          }
          ${uploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className="w-12 h-12 text-gray-400" />
          {uploading ? (
            <p className="text-gray-500">Đang tải lên...</p>
          ) : (
            <>
              <p className="text-gray-600">
                {isDragActive
                  ? "Thả ảnh vào đây"
                  : "Kéo thả ảnh vào đây hoặc click để chọn"}
              </p>
              <p className="text-sm text-gray-400">
                {multiple
                  ? `Tối đa ${maxFiles} ảnh, định dạng: PNG, JPG, WEBP`
                  : "Chỉ chọn 1 ảnh, định dạng: PNG, JPG, WEBP"}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Preview Images */}
      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={typeof preview === "string" ? optimizeProduct(preview) : preview}
                alt={`Preview ${index + 1}`}
                className="object-cover w-full h-24 rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;