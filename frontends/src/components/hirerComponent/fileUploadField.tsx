type FileUploadFieldProps = {
    id: string;
    label: string;
    accept: string;
    fileUrl: string;
    onFileSelected: (file: File) => void;
    previewType?: "image" | "pdf";
};

export default function FileUploadField({
    id,
    label,
    accept,
    fileUrl,
    onFileSelected,
    previewType,
}: FileUploadFieldProps) {

    // Handles file selection from input
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        // Checks if files exist
        if (!files || files.length === 0) {
            return;
        }
        const selectedFile = files[0];
        console.log("File selected:", selectedFile.name);
        onFileSelected(selectedFile);
    };
    return (
        <div>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-white-700"
            >
                {label}
            </label>
            <input
                type="file"
                id={id}
                name={id}
                accept={accept}
                onChange={handleFileChange}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {previewType === "image" && fileUrl.startsWith("data:image/") && (
                <img
                    src={fileUrl}
                    alt="Uploaded preview"
                    className="mt-2 h-32 w-full object-cover rounded-md border border-gray-300"
                />
            )}
            {previewType === "pdf" && fileUrl.startsWith("data:application/pdf") && (
                <p className="mt-2 text-sm text-gray-600">PDF Doc Uploaded</p>
            )}
        </div>
    );
}