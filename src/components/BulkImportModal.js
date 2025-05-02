import React, { useState, useEffect, useRef } from 'react';
import { useFlashcard } from '../contexts/FlashcardContext';
import '../css/components/BulkImportModal.css';

function BulkImportModal({ onClose, flashcardSetId, onImportSuccess }) {
    const { bulkImportFlashcards } = useFlashcard();
    const [importText, setImportText] = useState('');
    const [termSeparatorType, setTermSeparatorType] = useState('tab');
    const [cardSeparatorType, setCardSeparatorType] = useState('dòng mới');
    const [previewCards, setPreviewCards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [customTermSeparator, setCustomTermSeparator] = useState('/');
    const [customCardSeparator, setCustomCardSeparator] = useState('|');

    // Parse the import text to generate a preview
    useEffect(() => {
        if (!importText.trim()) {
            setPreviewCards([]);
            return;
        }

        try {
            // Xác định separator dựa trên loại đã chọn cho định nghĩa
            let termSeparator;
            switch (termSeparatorType) {
                case 'tab':
                    termSeparator = '\t';
                    break;
                case 'chấm phẩy':
                    termSeparator = ';';
                    break;
                case 'tùy chỉnh':
                    termSeparator = customTermSeparator;
                    break;
                default:
                    termSeparator = '\t';
            }

            // Xác định separator dựa trên loại đã chọn cho thẻ
            let cardSeparator;
            switch (cardSeparatorType) {
                case 'dòng mới':
                    cardSeparator = '\n';
                    break;
                case 'chấm phẩy':
                    cardSeparator = ';';
                    break;
                case 'tùy chỉnh-card':
                    cardSeparator = customCardSeparator;
                    break;
                default:
                    cardSeparator = '\n';
            }
            
            // Split text into items based on card separator
            const items = importText.split(cardSeparator).filter(item => item.trim() !== '');
            
            // Parse each item into term-definition pairs
            const cards = items.map(item => {
                const parts = item.split(termSeparator);
                if (parts.length >= 2) {
                    return {
                        term: parts[0].trim(),
                        definition: parts[1].trim(),
                        example: parts[2] ? parts[2].trim() : '',
                        flashcardSetId: flashcardSetId
                    };
                }
                return null;
            }).filter(card => card !== null);
            
            setPreviewCards(cards);
            setError('');
        } catch (err) {
            setError('Lỗi khi phân tích dữ liệu. Vui lòng kiểm tra định dạng.');
            setPreviewCards([]);
        }
    }, [importText, termSeparatorType, cardSeparatorType, customTermSeparator, customCardSeparator, flashcardSetId]);

    const handleImport = async () => {
        console.log("handleImport triggered in BulkImportModal");
        if (previewCards.length === 0) {
            setError('Không có thẻ nào để nhập');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            console.log("About to call bulkImportFlashcards with:", {
                flashcardSetId,
                cardsCount: previewCards.length,
                firstCard: previewCards[0]
            });
            
            // Use the bulkImportFlashcards function from context
            await bulkImportFlashcards(flashcardSetId, previewCards);
            console.log("bulkImportFlashcards completed successfully");
            
            // Call the success callback and close the modal
            onImportSuccess();
            onClose();
        } catch (err) {
            console.error('Error importing cards:', err);
            setError(err.message || 'Lỗi khi nhập thẻ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bulk-import-modal">
            <div className="bulk-import-header">
                <h2>Nhập dữ liệu</h2>
                <button className="bulk-import-close" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
            </div>
            
            <div className="bulk-import-body">
                <div className="input-section">
                    <h3>Nhập dữ liệu</h3>
                    <textarea 
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                        placeholder="Hello / xin chào&#10;Hi / chào"
                        rows={6}
                    ></textarea>
                </div>
                
                <div className="separator-options">
                    <div className="options-group">
                        <div className="options-group-title">Giữa thuật ngữ và định nghĩa</div>
                        <label className="radio-option">
                            <input 
                                type="radio" 
                                name="separator-term" 
                                checked={termSeparatorType === 'tab'} 
                                onChange={() => setTermSeparatorType('tab')} 
                            />
                            Tab
                        </label>
                        <label className="radio-option">
                            <input 
                                type="radio" 
                                name="separator-term" 
                                checked={termSeparatorType === 'chấm phẩy'} 
                                onChange={() => setTermSeparatorType('chấm phẩy')} 
                            />
                            Chấm phẩy (;)
                        </label>
                        <label className="radio-option">
                            <input 
                                type="radio" 
                                name="separator-term" 
                                checked={termSeparatorType === 'tùy chỉnh'} 
                                onChange={() => setTermSeparatorType('tùy chỉnh')} 
                            />
                            <div className="custom-input">
                                Tùy chỉnh:
                                <input 
                                    type="text" 
                                    maxLength={1} 
                                    value={customTermSeparator}
                                    onChange={(e) => setCustomTermSeparator(e.target.value)}
                                    disabled={termSeparatorType !== 'tùy chỉnh'} 
                                />
                            </div>
                        </label>
                    </div>
                    
                    <div className="options-group">
                        <div className="options-group-title">Giữa các thẻ</div>
                        <label className="radio-option">
                            <input 
                                type="radio" 
                                name="separator-card" 
                                checked={cardSeparatorType === 'dòng mới'} 
                                onChange={() => setCardSeparatorType('dòng mới')} 
                            />
                            Dòng mới
                        </label>
                        <label className="radio-option">
                            <input 
                                type="radio" 
                                name="separator-card" 
                                checked={cardSeparatorType === 'chấm phẩy'} 
                                onChange={() => setCardSeparatorType('chấm phẩy')} 
                            />
                            Chấm phẩy (;)
                        </label>
                        <label className="radio-option">
                            <input 
                                type="radio" 
                                name="separator-card" 
                                checked={cardSeparatorType === 'tùy chỉnh-card'} 
                                onChange={() => setCardSeparatorType('tùy chỉnh-card')} 
                            />
                            <div className="custom-input">
                                Tùy chỉnh:
                                <input 
                                    type="text" 
                                    maxLength={1} 
                                    value={customCardSeparator}
                                    onChange={(e) => setCustomCardSeparator(e.target.value)}
                                    disabled={cardSeparatorType !== 'tùy chỉnh-card'} 
                                />
                            </div>
                        </label>
                    </div>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="preview-section">
                    <div className="preview-header">
                        Xem trước ({previewCards.length} thẻ)
                    </div>
                    
                    {previewCards.length > 0 ? (
                        <table className="preview-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Thuật ngữ</th>
                                    <th>Định nghĩa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previewCards.slice(0, 5).map((card, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{card.term}</td>
                                        <td>{card.definition}</td>
                                    </tr>
                                ))}
                                {previewCards.length > 5 && (
                                    <tr>
                                        <td colSpan="3" style={{textAlign: 'center', fontStyle: 'italic'}}>
                                            ...và {previewCards.length - 5} thẻ khác
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{padding: '1rem', textAlign: 'center'}}>
                            Không có thẻ nào để xem trước. Vui lòng nhập dữ liệu.
                        </div>
                    )}
                </div>
                
                <div className="bulk-import-actions">
                    <button className="btn-cancel" onClick={onClose}>
                        Hủy
                    </button>
                    <button 
                        className="btn-import" 
                        onClick={handleImport}
                        disabled={isLoading || previewCards.length === 0}
                    >
                        {isLoading ? 'Đang nhập...' : 'Nhập dữ liệu'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BulkImportModal; 