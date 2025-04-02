import React from 'react';
import { Link } from 'react-router-dom';

function DictionaryWidget() {
    return (
        <div className="dictionary-widget">
            <div className="widget-header">
                <h3>Dictionary</h3>
                <button className="btn btn-sm btn-outline">
                    <i className="fas fa-times"></i>
                </button>
            </div>
            <div className="widget-body">
                <div className="search-box">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search for a word..."
                    />
                    <button className="btn btn-primary">
                        <i className="fas fa-search"></i>
                    </button>
                </div>
                <div className="word-details">
                    <h2 className="word">Example</h2>
                    <div className="pronunciation">
                        <span className="text-muted">/ɪɡˈzɑːmpl/</span>
                        <button className="btn btn-sm btn-link">
                            <i className="fas fa-volume-up"></i>
                        </button>
                    </div>
                    <div className="definitions">
                        <div className="definition">
                            <p className="pos">noun</p>
                            <p className="meaning">A representative form or pattern</p>
                            <div className="example">
                                <p className="text-muted">"This is an example of proper usage."</p>
                            </div>
                        </div>
                        <div className="definition">
                            <p className="pos">verb</p>
                            <p className="meaning">To serve as a pattern or model</p>
                            <div className="example">
                                <p className="text-muted">"The teacher exemplified the concept."</p>
                            </div>
                        </div>
                    </div>
                    <div className="related-words">
                        <h4>Related Words</h4>
                        <div className="tags">
                            <span className="badge badge-light">exemplify</span>
                            <span className="badge badge-light">exemplary</span>
                            <span className="badge badge-light">exemplification</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="widget-footer">
                <button className="btn btn-outline-primary">
                    <i className="fas fa-plus"></i> Add to Flashcards
                </button>
            </div>
        </div>
    );
}

export default DictionaryWidget; 