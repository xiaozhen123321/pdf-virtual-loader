import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styles from './pdf-virtual-loader.module.scss';

// 配置 PDF.js worker（react-pdf 内部依赖）
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString();
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

console.log('pdfjs.version', pdfjs.version);

export interface PdfVirtualLoaderProps {
    url: string | ArrayBuffer;
    width?: number;
    scale?: number;
    onLoadSuccess?: (numPages: number) => void;
    onLoadError?: (error: Error) => void;
    className?: string;
}

export function PdfVirtualLoader({
    url,
    width = 800,
    scale = 1.5,
    onLoadSuccess,
    onLoadError,
    className,
}: PdfVirtualLoaderProps) {
    const [numPages, setNumPages] = useState<number>(0);

    const handleDocumentLoadSuccess = useCallback(
        ({ numPages: loadedPages }: { numPages: number }) => {
            setNumPages(loadedPages);
            onLoadSuccess?.(loadedPages);
        },
        [onLoadSuccess]
    );

    const handleDocumentLoadError = useCallback(
        (error: Error) => {
            onLoadError?.(error);
            console.error('Error loading PDF:', error);
        },
        [onLoadError]
    );

    return (
        <div className={`${styles['container']} ${className || ''}`} style={{ width }}>
            <Document
                file={url}
                onLoadSuccess={handleDocumentLoadSuccess}
                onLoadError={handleDocumentLoadError}
                loading={<div className={styles['loading']}>Loading PDF...</div>}
                error={<div className={styles['loading']}>Failed to load PDF</div>}
                style={{ width: '100%', height: '100%' }}
            >
                {Array.from({ length: numPages }, (_, index) => (
                    <div key={index + 1} className={styles['page-container']}>
                        <Page
                            pageNumber={index + 1}
                            scale={scale}
                            className={styles['page-canvas']}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                        />
                    </div>
                ))}
            </Document>
        </div>
    );
}

export default PdfVirtualLoader;
