import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import imageCompression from 'browser-image-compression';

const ImageUpload = ({ value = [], onChange, multiple = true }) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      fileType: 'image/jpeg',
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Compress error:', error);
      return file;
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);

    try {
      const compressedFiles = await Promise.all(
        acceptedFiles.map(file => compressImage(file))
      );

      const uploadPromises = compressedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        // ✅ Lấy token từ localStorage
        const token = localStorage.getItem('adminToken');

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: {
            // ✅ Thêm token vào header Authorization
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Upload failed');
        }

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...value, ...uploadedUrls]);

      toast({
        title: 'Upload thành công',
        description: `Đã upload ${uploadedUrls.length} ảnh`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload thất bại',
        description: error.message || 'Có lỗi xảy ra',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  }, [value, onChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    multiple,
    disabled: uploading,
  });

  const removeImage = (indexToRemove) => {
    const newValue = value.filter((_, index) => index !== indexToRemove);
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Ảnh ${index + 1}`}
                className="object-cover w-full h-24 border rounded-lg"
                width="100"
                height="96"
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute p-1 text-white transition bg-red-500 rounded-full opacity-0 top-1 right-1 group-hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition
          ${isDragActive ? 'border-brand-primary bg-brand-background' : 'border-gray-300 hover:border-brand-primary
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-t-2 border-b-2 rounded-full animate-spin border-brand-primary"></div>
              <span className="text-sm text-gray-500 upload...</span>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 />
              <p className="text-base text-gray-600
                {isDragActive ? 'Thả ảnh vào đây' : 'Kéo thả ảnh vào đây hoặc click để chọn'}
              </p>
              <p className="text-sm text-gray-400
                Hỗ trợ: JPG, PNG, WEBP, GIF, BMP, SVG
              </p>
              <p className="text-sm text-gray-400
                Đã chọn: {value.length} ảnh
              </p>
              <p className="text-xs text-blue-500">
                💡 Ảnh sẽ được nén tự động (tối đa 1MB)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
