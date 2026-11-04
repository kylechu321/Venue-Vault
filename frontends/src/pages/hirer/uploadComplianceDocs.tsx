import { LayOut } from "@/components/layout/layOut";
import FileUploadField from "@/components/hirerComponent/fileUploadField";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UseWebAuthGuard } from "@/components/webAuthGuard";
import { hirerApi } from "@/services/hirerApi";
import { Hirer } from "@/types/hirer";

export default function UploadComplianceDocs() {
    UseWebAuthGuard();
    const [driverLicenseUrl, setDriverLicenseUrl] = useState("");
    const [insurancePdfUrl, setInsurancePdfUrl] = useState("");
    const [certificatePdfUrl, setCertificatePdfUrl] = useState("");
    const [hirerId, setHirerId] = useState<number | null>(null);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedJpgTypes = ["image/jpeg", "image/jpg"];
    const allowedPdfTypes = ["application/pdf"];


    // validate file uploads and convert to data URL for storage
    const validateUpload = (file: File, allowedTypes: string[], label: string) => {
        if (!allowedTypes.includes(file.type)) {
            alert(`Please upload a valid ${label} file.`);
            return false;
        }

        if (file.size > maxFileSize) {
            alert("File is too large. Please upload a file smaller than 5MB.");
            return false;
        }

        return true;
    };

    const getCurrentUserId = () => {
        const storedUser = localStorage.getItem("loggedInUser");
        if (!storedUser) {
            return null;
        }

        try {
            const parsedUser = JSON.parse(storedUser) as { id?: string };
            return parsedUser.id ?? null;
        } catch (error) {
            console.error("Failed to parse logged in user", error);
            return null;
        }
    };

    useEffect(() => {
    loadComplianceDocs();
}, []);

const loadComplianceDocs = async () => {
        const currentUserId = getCurrentUserId();
        if (!currentUserId) {
            setError("No logged-in user found. Please log in again.");
            return;
        }

        try {
            const loadedHirer = (await hirerApi.getHirerByUserID(Number(currentUserId))) as Hirer | null;
            if (!loadedHirer) {
                setError("No hirer record found for the logged-in user.");
                return;
            }

            setHirerId(loadedHirer.id);

            // Helper to convert backend base64 strings to proper data URLs for browser rendering
            const toDataUrl = (value: string | undefined, kind: "image" | "pdf") => {
                if (!value || value.trim() === ""){ 
                    return "";
                }
                if (value.startsWith("data:")){
                    return value;
                } 
                
                if (kind === "image"){ 
                    return `data:image/jpeg;base64,${value}`;
                }

                return `data:application/pdf;base64,${value}`;
            };

            // Read properties straight from the updated string fields
            setDriverLicenseUrl(toDataUrl(loadedHirer.driverLicenseDoc, "image"));
            setInsurancePdfUrl(toDataUrl(loadedHirer.insuranceDoc, "pdf"));
            setCertificatePdfUrl(toDataUrl(loadedHirer.registrationDoc, "pdf"));
            
        } catch (fetchError) {
            console.error("Failed to load compliance docs", fetchError);
            setError("Failed to load compliance documents from the backend.");
        }
    };


    const handleSave = async (
        type: "license" | "insurance" | "certification",
        fileUrl: string
    ) => {
        if (!hirerId) {
            setError("No hirer record found for the logged-in user.");
            return;
        }

        const updatedDocs = {
            driverLicenseDoc: type === "license" ? fileUrl : driverLicenseUrl,
            insuranceDoc: type === "insurance" ? fileUrl : insurancePdfUrl,
            registrationDoc: type === "certification" ? fileUrl : certificatePdfUrl,
        };

        try {
            const updatedHirer = await hirerApi.updateComplianceDocs(hirerId, updatedDocs);
            const toDataUrl = (value: string | undefined, kind: "image" | "pdf") => {
                if (!value) return "";
                if (value.startsWith("data:")) return value;
                if (kind === "image") return `data:image/jpeg;base64,${value}`;
                return `data:application/pdf;base64,${value}`;
            };

            setDriverLicenseUrl(toDataUrl(updatedHirer.driverLicenseDoc ?? updatedDocs.driverLicenseDoc, "image"));
            setInsurancePdfUrl(toDataUrl(updatedHirer.insuranceDoc ?? updatedDocs.insuranceDoc, "pdf"));
            setCertificatePdfUrl(toDataUrl(updatedHirer.registrationDoc ?? updatedDocs.registrationDoc, "pdf"));
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (saveError) {
            console.error("Failed to save compliance docs", saveError);
            setError("Failed to save compliance documents to the backend.");
        }
    };

    /* Web API for uploading files from: FileReader - Web APIs | MDN. (n.d.). Developer.mozilla.org. 
        https://developer.mozilla.org/en-US/docs/Web/API/FileReader */

    const handleFileUpload = (
        file: File,
        allowedTypes: string[],
        label: string,
        setter: React.Dispatch<React.SetStateAction<string>>,
        onUploadComplete: (fileDataUrl: string) => void
    ) => {
        if (!validateUpload(file, allowedTypes, label)) return;

        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const fileDataUrl = String(reader.result || "");
            setter(fileDataUrl);
            onUploadComplete(fileDataUrl);
        });
        reader.addEventListener("error", () => {
            console.error("Failed to read uploaded file", reader.error);
            alert("Unable to read uploaded file. Please try again.");
        });
        reader.readAsDataURL(file);
    };

    return (
        <LayOut>
            <h1 className="m-0 text-[clamp(2rem,4vw,3rem)] font-extralight leading-[1.1] tracking-[-0.02em]">
                Upload Compliance Documents
            </h1>

            {error && (
                <div className="mt-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                    {error}
                </div>
            )}

            {saved && (
                <div className="mt-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
                    Compliance document updated successfully.
                </div>
            )}

            <div className="mb-4">
                    <Link href="/hirer/profile" className="text-blue-500 underline text-sm">
                        ← Return to Profile
                    </Link>
                </div>
            
            <FileUploadField
                id="driverLicense"
                label="Upload Driver License (JPG)"
                accept=".jpg,.jpeg"
                fileUrl={driverLicenseUrl}
                previewType="image"
                onFileSelected={(file) => {
                    handleFileUpload(
                        file,
                        allowedJpgTypes,
                        "JPG/JPEG",
                        setDriverLicenseUrl,
                        (fileDataUrl) => handleSave("license", fileDataUrl)
                    );
                }}
            />
            

            <FileUploadField
                id="insurancePdf"
                label="Upload Insurance (PDF)"
                accept=".pdf"
                fileUrl={insurancePdfUrl}
                previewType="pdf"
                onFileSelected={(file) => {
                    handleFileUpload(
                        file,
                        allowedPdfTypes,
                        "PDF",
                        setInsurancePdfUrl,
                        (fileDataUrl) => handleSave("insurance", fileDataUrl)
                    );
                }}
            />

            <FileUploadField
                id="certificatePdf"
                label="Upload Certificate (PDF)"
                accept=".pdf"
                fileUrl={certificatePdfUrl}
                previewType="pdf"
                onFileSelected={(file) => {
                    handleFileUpload(
                        file,
                        allowedPdfTypes,
                        "PDF",
                        setCertificatePdfUrl,
                        (fileDataUrl) => handleSave("certification", fileDataUrl)
                    );
                }}
            />
        </LayOut>
    );
}
