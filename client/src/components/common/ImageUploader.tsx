import React, { useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  files,
  onChange,
  maxFiles = 5,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const combined = [...files, ...selectedFiles].slice(0, maxFiles);
      onChange(combined);
    }
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Item Photos ({files.length}/{maxFiles})
        </label>
        <span className="text-xs text-slate-500 font-medium">Up to 5MB each (JPEG, PNG, WEBP)</span>
      </div>

      {/* Grid of uploaded previews & add trigger */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {files.map((file, index) => {
          const previewUrl = URL.createObjectURL(file);
          return (
            <div
              key={index}
              className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm"
            >
              <img
                src={previewUrl}
                alt={`Upload preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1.5 right-1.5 p-1 bg-black/70 text-rose-300 hover:text-white rounded-full opacity-90 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
              {index === 0 && (
                <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-campus-lime text-slate-950 text-[10px] font-black rounded-md shadow-sm">
                  Cover
                </div>
              )}
            </div>
          );
        })}

        {files.length < maxFiles && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-slate-100 transition-all text-slate-500 hover:text-emerald-700 group p-2 shadow-sm"
          >
            <UploadCloud size={24} className="mb-1 group-hover:scale-110 transition-transform text-emerald-600" />
            <span className="text-xs font-bold text-center">Add Photo</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
