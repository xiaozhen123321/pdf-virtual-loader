import { useState } from 'react';
import { PdfVirtualLoader } from '@pdf/pdf-virtual-loader';
import styles from './app.module.scss';

type PdfSource = string | ArrayBuffer | null;

export function App() {
    const [pdfUrl, setPdfUrl] = useState('');
    const [pdfSource, setPdfSource] = useState<PdfSource>(null);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [numPages, setNumPages] = useState(0);

    const handleLoadSuccess = (pages: number) => {
        setNumPages(pages);
        console.log(`PDF loaded successfully with ${pages} pages`);
    };

    const handleLoadError = (error: Error) => {
        console.error('Failed to load PDF:', error);
        alert('Failed to load PDF. Please check the file or URL and try again.');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pdfUrl.trim()) {
            setPdfSource(pdfUrl.trim());
            setUploadedFileName('');
            setNumPages(0);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Please upload a valid PDF file.');
            event.target.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result) {
                setPdfSource(reader.result as ArrayBuffer);
                console.log('PDF file loaded successfully', reader.result);
                setUploadedFileName(file.name);
                setPdfUrl('');
                setNumPages(0);
            }
            event.target.value = '';
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>PDF Virtual Loader Demo</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label className={styles.label}>PDF URL</label>
                    <div className={styles.urlRow}>
                        <input
                            type="text"
                            placeholder="https://example.com/sample.pdf"
                            value={pdfUrl}
                            onChange={(e) => setPdfUrl(e.target.value)}
                            className={styles.input}
                        />
                        <button type="submit" className={styles.button}>
                            Load
                        </button>
                    </div>
                    <span className={styles.divider}>or</span>
                    <label htmlFor="pdf-upload" className={styles.label}>
                        Upload PDF
                    </label>
                    <input
                        id="pdf-upload"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className={styles.fileInput}
                    />
                    {uploadedFileName && (
                        <p className={styles.info}>Loaded file: {uploadedFileName}</p>
                    )}
                </form>
                {numPages > 0 && (
                    <p className={styles.info}>Total pages: {numPages}</p>
                )}
            </header>

            <main className={styles.main}>
                {pdfSource ? (
                    <div className={styles.viewerWrapper}>
                        <PdfVirtualLoader
                            url={pdfSource}
                            width={800}
                            scale={1.5}
                            onLoadSuccess={handleLoadSuccess}
                            onLoadError={handleLoadError}
                        />
                    </div>
                ) : (
                    <div className={styles.placeholder}>
                        <p>Upload a PDF file or enter a PDF URL to get started</p>
                        <p className={styles.hint}>
                            Sample URL:
                            <br />
                            https://arxiv.org/pdf/1706.03762.pdf
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
