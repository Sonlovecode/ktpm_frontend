import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slides = [
        {
            id: 1,
            image: "https://cdn.tgdd.vn/Files/2023/09/15/1547384/applecopy-150923-105251.jpg",
            title: "iPhone 15 Series",
            description: "Khám phá dòng sản phẩm mới nhất từ Apple",
            link: "/products/iphone-15"
        },
        {
            id: 2,
            image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/1/13/1137902/Screen-Shot-2023-01-.jpg",
            title: "Samsung Galaxy Z Fold",
            description: "Trải nghiệm công nghệ màn hình gập đột phá",
            link: "/products/samsung-fold"
        },
        {
            id: 3,
            image: "https://cdn.tgdd.vn/Files/2023/09/26/1549193/xiaomih2-260923-223209-800-resize.jpg",
            title: "Xiaomi 13T Series",
            description: "Hiệu năng mạnh mẽ, giá cả hợp lý",
            link: "/products/xiaomi-13t"
        }
    ];

    // Auto slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        
        return () => clearInterval(interval);
    }, [slides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    return (
        <section className="hero-slider">
            <div className="container">
                <div className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="#mainCarousel"
                                data-bs-slide-to={index}
                                className={index === currentSlide ? "active" : ""}
                                onClick={() => goToSlide(index)}
                                aria-current={index === currentSlide ? "true" : "false"}
                                aria-label={`Slide ${index + 1}`}
                            ></button>
                        ))}
                    </div>

                    <div className="carousel-inner">
                        {slides.map((slide, index) => (
                            <div 
                                key={slide.id} 
                                className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
                            >
                                <Link to={slide.link} className="d-block">
                                    <img 
                                        src={slide.image} 
                                        className="d-block w-100" 
                                        alt={slide.title}
                                    />
                                    <div className="carousel-caption">
                                        <h2 className="display-4 fw-bold">{slide.title}</h2>
                                        <p className="lead">{slide.description}</p>
                                        <button className="btn btn-light btn-lg mt-2">
                                            Xem ngay
                                        </button>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <button 
                        className="carousel-control-prev" 
                        type="button" 
                        onClick={goToPrevSlide}
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button 
                        className="carousel-control-next" 
                        type="button" 
                        onClick={goToNextSlide}
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Slider; 