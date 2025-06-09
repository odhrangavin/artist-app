
export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const minEdge = 2;
        const maxEdge = totalPages - 1;

        if (totalPages <= 6) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        pages.push(1);

        let start = Math.max(page - 1, minEdge);
        let end = Math.min(page + 1, maxEdge);

        // If near the start, show first 4 pages before ellipsis
        if (page <= 3) {
            start = 2;
            end = 4;
        }
        // If near the end, show last 4 pages after ellipsis
        if (page >= totalPages - 2) {
            start = totalPages - 3;
            end = totalPages - 1;
        }

        if (start > minEdge) pages.push("...");

        for (let i = start; i <= end; i++) {
            if (i > 1 && i < totalPages) pages.push(i);
        }

        if (end < maxEdge) pages.push("...");

        pages.push(totalPages);

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="pagination">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
            >
                &lt; Prev
            </button>
            {pageNumbers.map((num, idx) =>
                num === "..." ? (
                    <span key={`ellipsis-${idx}`} style={{ padding: "0 4px" }}>...</span>
                ) : (
                    <button
                        key={num}
                        onClick={() => onPageChange(num)}
                        disabled={num === page}
                        aria-label={`Page ${num}`}
                        style={{
                            background: num === page ? "#1a1a1a" : "#eee",
                            color: num === page ? "#fff" : "#222",
                            border: "none",
                            borderRadius: "4px",
                            padding: "6px 12px",
                            fontWeight: num === page ? "bold" : "normal",
                            cursor: num === page ? "default" : "pointer"
                        }}
                    >
                        {num}
                    </button>
                )
            )}
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
                style={{ padding: "6px 10px" }}
            >
                Next &gt;
            </button>
        </div>
    );
}