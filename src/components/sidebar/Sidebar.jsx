import React, { useState } from 'react'
import './Sidebar.css'
import { pages } from '../../data'
import { useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const Sidebar = () => {
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <div className="mobile-menu" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X /> : <Menu />}
            </div>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className='sidebar-header'>
                    <div className="sidebar-menu" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X /> : <Menu />}
                    </div>
                    <h2>لوحة التحكم</h2>
                </div>
                <div className='sidebar-divider'></div>
                <ul className='sidebar-list'>
                    {
                        pages.map((page, index) => (
                            <li key={index}>
                                <a href={page.link} className={location.pathname === page.link ? 'active' : ''}>
                                    <span className="icon">{page.icon}</span>
                                    <span className='name'>{page.name}</span>
                                </a>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
