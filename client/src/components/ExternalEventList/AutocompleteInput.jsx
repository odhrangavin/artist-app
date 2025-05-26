import { useState, useRef, useEffect } from "react";

export default function AutocompleteInput({
    value,
    onChange,
    suggestions,
    placeholder,
    onClear,
    disabled,
}) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [filtered, setFiltered] = useState(suggestions);
    const ref = useRef(null);

    // Filter options on value or suggestions change
    useEffect(() => {
        setFiltered(
            value
                ? suggestions.filter((s) =>
                    s.toLowerCase().includes(value.toLowerCase())
                )
                : suggestions
        );
    }, [value, suggestions]);

    function handleInput(e) {
        const val = e.target.value;
        onChange(val);
        setFiltered(
            suggestions.filter((s) =>
                s.toLowerCase().includes(val.toLowerCase())
            )
        );
        setShowDropdown(true);
    }

    function handleFocus() {
        setFiltered(suggestions);
        setShowDropdown(true);
    }

    function handleBlur() {
        setTimeout(() => setShowDropdown(false), 100);
    }

    function handleOption(option) {
        onChange(option);
        setShowDropdown(false);
    }

    function handleClear(e) {
        e.stopPropagation();
        onChange("");
        if (onClear) onClear();
        setFiltered(suggestions);
        setShowDropdown(true);
        ref.current.focus();
    }

    return (
        <div
            style={{
                position: "relative",
                minWidth: 180,
                display: "flex",
                alignItems: "center",
            }}
        >
            <input
                ref={ref}
                type="text"
                value={value}
                onChange={handleInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
                style={{ width: "100%" }}
            />
            {value && (
                <button
                    type="button"
                    tabIndex={-1}
                    style={{
                        position: "absolute",
                        right: 5,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 16,
                        color: "#888",
                    }}
                    onClick={handleClear}
                    title="Clear"
                >
                    ×
                </button>
            )}
            {showDropdown && filtered.length > 0 && (
                <ul
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        zIndex: 10,
                        background: "#242424",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                        borderRadius: 5,
                        width: "100%",
                        maxHeight: 180,
                        overflowY: "auto",
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                    }}
                >
                    {filtered.map((option) => (
                        <li
                            key={option}
                            style={{
                                padding: "6px 12px",
                                cursor: "pointer",
                                fontSize: 15,
                                borderBottom: "1px solid #f0f0f0",
                            }}
                            onMouseDown={() => handleOption(option)}
                            tabIndex={-1}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}