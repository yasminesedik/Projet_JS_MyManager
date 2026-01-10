// Export Utilities (CSV and PDF)
export class ExportUtils {
    static exportToCSV(data, filename = 'export.csv') {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        // Get headers from first object
        const headers = Object.keys(data[0]);
        
        // Create CSV content
        let csv = headers.join(',') + '\n';
        
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header] || '';
                // Escape commas and quotes
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csv += values.join(',') + '\n';
        });

        // Create blob and download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    static exportToPDF(data, title, filename = 'export.pdf') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text(title, 14, 20);

        // Add date
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

        if (!data || Object.keys(data).length === 0) {
            doc.text('No data available', 14, 40);
            doc.save(filename);
            return;
        }

        // Add content
        let y = 40;
        doc.setFontSize(12);
        
        Object.entries(data).forEach(([key, value]) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            
            const label = String(key).charAt(0).toUpperCase() + String(key).slice(1).replace(/([A-Z])/g, ' $1');
            const text = `${label}: ${value}`;
            doc.text(text, 14, y);
            y += 10;
        });

        doc.save(filename);
    }

    static exportTableToPDF(tableData, headers, title, filename = 'export.pdf') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text(title, 14, 20);

        // Add date
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

        if (!tableData || tableData.length === 0) {
            doc.text('No data available', 14, 40);
            doc.save(filename);
            return;
        }

        // Simple table rendering
        let y = 50;
        const startX = 14;
        const colWidth = 180 / headers.length;

        // Headers
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        headers.forEach((header, i) => {
            doc.text(header, startX + i * colWidth, y);
        });
        y += 10;

        // Data rows
        doc.setFont(undefined, 'normal');
        tableData.forEach(row => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            headers.forEach((header, i) => {
                const value = row[header] || '';
                doc.text(String(value).substring(0, 20), startX + i * colWidth, y);
            });
            y += 10;
        });

        doc.save(filename);
    }
}

