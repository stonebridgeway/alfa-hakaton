import { IconButton } from '@alfalab/core-components/icon-button';
import { Typography } from '@alfalab/core-components/typography';
import { AlfaBankLIcon } from '@alfalab/icons-logotype/AlfaBankLIcon';
import { BellMIcon } from '@alfalab/icons-glyph/BellMIcon';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useMarkRead, useNotifications } from '../api/hooks';
import { useAuth } from '../auth/AuthContext';
import { dateTime } from '../utils/format';
import { ExitMIcon } from './icons';

export interface NavItem {
    to: string;
    label: string;
    end?: boolean;
}

/** Знак банка и название кабинета в шапке; ведёт на главную раздела. */
export function Logo({ home, bank = false }: { home: string; bank?: boolean }) {
    return (
        <Link to={home} className='logo' aria-label='На главную'>
            <span className='logo__mark'>
                <AlfaBankLIcon width={21} height={32} aria-label='Альфа-Банк' />
            </span>
            <span>
                <Typography.Text view='primary-medium' weight='bold' tag='div'>
                    {bank ? 'Кредитный конвейер' : 'Кредитный кабинет'}
                </Typography.Text>
                <Typography.Text view='primary-small' color='secondary' tag='div'>
                    {bank ? 'Рабочее место аналитика' : 'для бизнеса'}
                </Typography.Text>
            </span>
        </Link>
    );
}

export function AppHeader({ nav, home, bank = false }: { nav: NavItem[]; home: string; bank?: boolean }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    return (
        <header className={`header${bank ? ' header--bank' : ''}`}>
            <div className='header__inner'>
                <Logo home={home} bank={bank} />
                <nav className='nav' aria-label='Разделы'>
                    {nav.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <div className='header__right'>
                    <NotificationsBell />
                    <div className='header__user'>
                        <Typography.Text view='primary-small' weight='medium' tag='div'>
                            {user?.full_name}
                        </Typography.Text>
                        <Typography.Text view='primary-small' color='secondary' tag='div'>
                            {user?.company?.name ?? user?.position}
                        </Typography.Text>
                    </div>
                    <IconButton
                        icon={ExitMIcon}
                        colors='inverted'
                        aria-label='Выйти'
                        title='Выйти'
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                    />
                </div>
            </div>
        </header>
    );
}

function NotificationsBell() {
    const { user } = useAuth();
    const { data } = useNotifications();
    const markRead = useMarkRead();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return undefined;
        const close = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [open]);

    const toggle = () => {
        const next = !open;
        setOpen(next);
        if (next && data?.unread) markRead.mutate();
    };

    const base = user?.role === 'CLIENT' ? '/client/applications' : '/bank/applications';
    return (
        <div className='bell' ref={ref}>
            <IconButton
                icon={BellMIcon}
                colors='inverted'
                aria-label='Уведомления'
                title='Уведомления'
                onClick={toggle}
            />
            {Boolean(data?.unread) && <span className='bell__count'>{data?.unread}</span>}
            {open && (
                <div
                    role='dialog'
                    aria-label='Уведомления'
                    className='notifications'
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 48,
                        width: 380,
                        maxHeight: 480,
                        overflowY: 'auto',
                        background: 'var(--color-light-base-bg-primary)',
                        borderRadius: 20,
                        boxShadow: 'var(--shadow-l, 0 8px 32px rgba(0,0,0,0.16))',
                        padding: 8,
                        zIndex: 100,
                    }}
                >
                    <Typography.Text view='primary-medium' weight='bold' tag='div' style={{ padding: '12px 12px 8px' }}>
                        Уведомления
                    </Typography.Text>
                    {!data?.items.length && (
                        <Typography.Text view='primary-small' color='secondary' tag='div' style={{ padding: 12 }}>
                            Пока ничего нового
                        </Typography.Text>
                    )}
                    {data?.items.map((item) => (
                        <button
                            key={item.id}
                            type='button'
                            className='demo-account'
                            style={{
                                width: '100%',
                                marginBottom: 4,
                                background: item.unread ? 'var(--color-light-base-bg-secondary)' : 'transparent',
                            }}
                            onClick={() => {
                                setOpen(false);
                                if (item.application_id) navigate(`${base}/${item.application_id}`);
                            }}
                        >
                            <Typography.Text view='primary-small' weight='medium' tag='div'>
                                {item.title}
                            </Typography.Text>
                            {item.body && (
                                <Typography.Text view='primary-small' color='secondary' tag='div'>
                                    {item.body}
                                </Typography.Text>
                            )}
                            <Typography.Text view='primary-small' color='tertiary' tag='div'>
                                {dateTime(item.created_at)}
                            </Typography.Text>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
