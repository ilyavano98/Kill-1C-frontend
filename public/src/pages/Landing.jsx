import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Button, Card, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  BiUserPlus, BiCar, BiCalendarCheck, BiGroup, BiBarChart, BiTime,
  BiCheckCircle, BiBuildings, BiUser, BiDollarCircle, BiHappy,
  BiChevronUp, BiRocket, BiShield
} from 'react-icons/bi';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import './Landing.css';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, ArcElement, Filler
);

const Landing = () => {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState({});
  const [animatedValue, setAnimatedValue] = useState(0);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [activeMetric, setActiveMetric] = useState('profit');

  const featuresRef = useRef(null);
  const problemsRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const faqRef = useRef(null);

  // Функции перехода (работают 100%)
  const goToRegister = () => navigate('/register');
  const goToLogin = () => navigate('/login');

  // Анимация цифр
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValue(prev => {
        if (prev >= 30) return 0;
        return prev + 1;
      });
      setAnimatedPercent(prev => {
        if (prev >= 70) return 0;
        return prev + 1.4;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Смена метрики для графика
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric(prev => {
        if (prev === 'profit') return 'occupancy';
        if (prev === 'occupancy') return 'errors';
        return 'profit';
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );

    const sections = ['stats-section', 'problems-section', 'features-section', 'testimonials-section', 'faq-section'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Данные для графиков
  const profitData = {
    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
    datasets: [{
      label: 'Выручка, тыс. ₽',
      data: [120, 145, 168, 190, 225, 260],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#fff',
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
  };

  const occupancyData = {
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    datasets: [{
      label: 'Загрузка боксов, %',
      data: [65, 72, 78, 82, 88, 92, 85],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  const errorsData = {
    labels: ['Нед 1', 'Нед 2', 'Нед 3', 'Нед 4'],
    datasets: [{
      label: 'Ошибки учёта, шт',
      data: [24, 18, 11, 5],
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239,68,68,0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  const doughnutData = {
    labels: ['Занято', 'Свободно'],
    datasets: [{
      data: [78, 22],
      backgroundColor: ['#3b82f6', 'rgba(59,130,246,0.2)'],
      borderWidth: 0,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { labels: { color: '#fff', font: { size: 10 } } } },
    scales: { y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { ticks: { color: '#94a3b8' } } }
  };

  const getCurrentChart = () => {
    if (activeMetric === 'profit') return <Line data={profitData} options={chartOptions} />;
    if (activeMetric === 'occupancy') return <Line data={occupancyData} options={chartOptions} />;
    return <Line data={errorsData} options={chartOptions} />;
  };

  const getMetricTitle = () => {
    if (activeMetric === 'profit') return '📈 Рост выручки';
    if (activeMetric === 'occupancy') return '🚗 Загрузка боксов';
    return '⚠️ Снижение ошибок';
  };

  const getMetricValue = () => {
    if (activeMetric === 'profit') return `+${animatedValue}%`;
    if (activeMetric === 'occupancy') return `+${Math.floor(animatedValue * 0.8)}%`;
    return `-${Math.floor(animatedPercent)}%`;
  };

  const features = [
    { icon: BiUserPlus, title: 'Клиентская база', desc: 'Вся история, автомобили и предпочтения. Ничего не теряется.' },
    { icon: BiCalendarCheck, title: 'Расписание боксов', desc: 'Почасовая занятость. Исключаем двойные записи.' },
    { icon: BiGroup, title: 'Контроль персонала', desc: 'Смены, загрузка, KPI. Прозрачность работы команды.' },
    { icon: BiBarChart, title: 'Финансовая отчётность', desc: 'Выручка по дням, услугам, сотрудникам. В реальном времени.' },
    { icon: BiCar, title: 'Учёт автомобилей', desc: 'Марка, модель, год, тип кузова. Несколько авто на клиента.' },
    { icon: BiTime, title: 'Автоматизация', desc: 'Сократите рутину на 70%. Всё в одной системе. Успехи всех автомоек на одном графике' },
  ];

  const problems = [
    { icon: BiUser, text: 'Теряете клиентов из-за путаницы в записях?' },
    { icon: BiBuildings, text: 'Боксы простаивают, а график — в Excel?' },
    { icon: BiGroup, text: 'Не видите реальную загрузку сотрудников?' },
    { icon: BiDollarCircle, text: 'Выручка размыта, нет прозрачности?' },
  ];

  const solutions = [
    'Единая база клиентов и авто',
    'Наглядное расписание по боксам',
    'Контроль смен и KPI сотрудников',
    'Отчёты о выручке в один клик',
  ];

  const testimonials = [
    { name: 'Алексей, владелец сети из 3 моек', text: 'Навели порядок за 2 дня. Теперь вижу выручку в реальном времени и загрузку каждого бокса.', role: 'Краснодар', rating: 5 },
    { name: 'Екатерина, управляющая', text: 'Перестали терять клиентов. Сотрудники сами вносят записи, я только контролирую.', role: 'Москва', rating: 5 },
    { name: 'Дмитрий, администратор', text: 'Смены стали прозрачными. Вижу, кто сколько машин помыл.', role: 'СПб', rating: 5 },
  ];

  const faq = [
    { q: 'Нужно ли устанавливать программу?', a: 'Нет, это веб-приложение. Работает в браузере на любом устройстве.' },
    { q: 'Подходит для одной мойки?', a: 'Да, от 1 бокса до сетей. Тарифы гибкие.' },
    { q: 'Есть ли поддержка?', a: 'Да, чат и телефон. Помогаем с настройкой.' },
    { q: 'Что после 14 дней?', a: 'Выбираете тариф или замораживаете данные. Без автопродления.' },
  ];

  return (
    <div className="landing">
      {/* НАВИГАЦИЯ */}
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="landing-navbar">
        <Container>
          <Navbar.Brand href="#" className="fw-bold">
            <span className="brand-icon">🧼</span> WashCRM
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Главная</Nav.Link>
              <Nav.Link onClick={() => scrollTo(statsRef)}>Цифры</Nav.Link>
              <Nav.Link onClick={() => scrollTo(problemsRef)}>Проблемы</Nav.Link>
              <Nav.Link onClick={() => scrollTo(featuresRef)}>Возможности</Nav.Link>
              <Nav.Link onClick={() => scrollTo(testimonialsRef)}>Отзывы</Nav.Link>
              <Nav.Link onClick={() => scrollTo(faqRef)}>FAQ</Nav.Link>
            </Nav>
            <div className="landing-buttons">
              <Button variant="outline-light" size="sm" onClick={goToLogin} className="me-2">Вход</Button>
              <Button className="btn-primary-custom-sm" onClick={goToRegister}>Регистрация</Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* HERO С АНИМАЦИЕЙ СПРАВА */}
      <div className="hero">
        <div className="hero-overlay" />
        <Container className="hero-container">
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="hero-content fade-up">
              <h1 className="hero-title">
                Управляйте автомойкой<br />
                как <span className="highlight">профессионал</span>
              </h1>
              <p className="hero-subtitle">
                CRM, которая наводит порядок в записях, клиентах и финансах.<br />
                Загрузка боксов +30%, ошибок у персонала меньше на 70%.
              </p>
              <div className="hero-buttons">
                <Button className="btn-primary-custom" onClick={goToRegister}>
                  <BiRocket className="me-2" /> Попробовать 14 дней
                </Button>
                <Button variant="outline-light" onClick={goToLogin}>Войти</Button>
              </div>
              <p className="hero-footnote">Без карты. Отмена в любой момент.</p>
            </Col>

            <Col lg={6} className="hero-stats-panel fade-up-right">
              <div className="stats-panel">
                <div className="stats-header">
                  <span className="stats-badge">Результаты с WashCRM</span>
                  <span className="stats-live">LIVE</span>
                </div>

                <div className="stats-chart">
                  <div className="chart-header">
                    <span>{getMetricTitle()}</span>
                    <span className="chart-value pulse-number">{getMetricValue()}</span>
                  </div>
                  <div className="chart-container">
                    {getCurrentChart()}
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="stats-item">
                    <div className="stats-icon">💰</div>
                    <div className="stats-info">
                      <span className="stats-label">Выручка</span>
                      <span className="stats-number pulse-number">+{animatedValue}%</span>
                    </div>
                  </div>
                  <div className="stats-item">
                    <div className="stats-icon">📊</div>
                    <div className="stats-info">
                      <span className="stats-label">Загрузка</span>
                      <span className="stats-number pulse-number">+{Math.floor(animatedValue * 0.8)}%</span>
                    </div>
                  </div>
                  <div className="stats-item">
                    <div className="stats-icon">⚠️</div>
                    <div className="stats-info">
                      <span className="stats-label">Ошибки</span>
                      <span className="stats-number pulse-number">-{Math.floor(animatedPercent)}%</span>
                    </div>
                  </div>
                  <div className="stats-item">
                    <div className="stats-icon">⏱️</div>
                    <div className="stats-info">
                      <span className="stats-label">Времени</span>
                      <span className="stats-number pulse-number">-70%</span>
                    </div>
                  </div>
                </div>

                <div className="stats-footer">
                  <div className="doughnut-container">
                    <Doughnut data={doughnutData} options={{ cutout: '60%', plugins: { legend: { position: 'bottom', labels: { color: '#fff', font: { size: 10 } } } } }} />
                  </div>
                  <div className="stats-footer-text">
                    <span>Текущая загрузка боксов</span>
                    <strong>78%</strong>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ЦИФРЫ */}
      <Container id="stats-section" ref={statsRef} className={`stats-section ${visibleSections['stats-section'] ? 'visible' : ''}`}>
        <Row className="g-4">
          <Col md={3}><div className="stat-card"><div className="stat-value">15 мин</div><div className="stat-label">на запуск</div></div></Col>
          <Col md={3}><div className="stat-card"><div className="stat-value">98%</div><div className="stat-label">точность учёта</div></div></Col>
          <Col md={3}><div className="stat-card"><div className="stat-value">15 ч</div><div className="stat-label">экономии в неделю</div></div></Col>
          <Col md={3}><div className="stat-card"><div className="stat-value">30%</div><div className="stat-label">рост загрузки</div></div></Col>
        </Row>
      </Container>

      {/* ПРОБЛЕМЫ И РЕШЕНИЯ */}
      <div id="problems-section" ref={problemsRef} className={`problem-solution-wrapper ${visibleSections['problems-section'] ? 'visible' : ''}`}>
        <Container className="problem-solution">
          <h2 className="section-title">Знакомо?</h2>
          <Row className="g-4 align-items-center">
            <Col md={6}>
              {problems.map((p, idx) => (
                <div className="problem-item" key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                  <p.icon className="problem-icon" /> <span>{p.text}</span>
                </div>
              ))}
            </Col>
            <Col md={6}>
              <div className="solution-box">
                <h4>Вот что даёт CRM:</h4>
                {solutions.map((s, idx) => (
                  <div className="solution-item" key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                    <BiCheckCircle className="check-icon" /> {s}
                  </div>
                ))}
                <Button className="btn-primary-custom mt-4" onClick={goToRegister}>Решить проблемы</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ВОЗМОЖНОСТИ */}
      <div id="features-section" ref={featuresRef} className={`features-wrapper ${visibleSections['features-section'] ? 'visible' : ''}`}>
        <Container className="features-section">
          <h2 className="section-title">Всё, что нужно владельцу</h2>
          <Row className="g-4">
            {features.map((feat, idx) => (
              <Col md={4} key={idx}>
                <div className="feature-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <feat.icon className="feature-icon" />
                  <h4 className="feature-title">{feat.title}</h4>
                  <p className="feature-desc">{feat.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* ОТЗЫВЫ */}
      <div id="testimonials-section" ref={testimonialsRef} className={`testimonials-wrapper ${visibleSections['testimonials-section'] ? 'visible' : ''}`}>
        <Container className="testimonials">
          <h2 className="section-title">Уже управляют с нами</h2>
          <Row className="g-4">
            {testimonials.map((t, idx) => (
              <Col md={4} key={idx}>
                <div className="testimonial-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="testimonial-rating">{'★'.repeat(t.rating)}</div>
                  <BiHappy className="quote-icon" />
                  <p>{t.text}</p>
                  <div className="testimonial-author">{t.name}<br /><small>{t.role}</small></div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* FAQ */}
      <div id="faq-section" ref={faqRef} className={`faq-wrapper ${visibleSections['faq-section'] ? 'visible' : ''}`}>
        <Container className="faq-section">
          <h2 className="section-title">Остались вопросы?</h2>
          <Row className="g-4">
            {faq.map((item, idx) => (
              <Col md={6} key={idx}>
                <div className="faq-item" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <h5><BiShield className="faq-icon" /> {item.q}</h5>
                  <p>{item.a}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* ФИНАЛЬНЫЙ ПРИЗЫВ */}
      <div className="cta-final">
  <Container className="text-center">
    <div className="cta-glow"></div>
    <h2 className="cta-title">Начните управлять автомойкой профессионально</h2>
    <p className="cta-subtitle">Присоединяйтесь и контролируйте свою прибыль. 14 дней бесплатно.</p>
    <Button 
      className="btn-primary-custom btn-lg px-5" 
      onClick={() => window.location.href = '/register'}
    >
      <BiRocket className="me-2" /> Зарегистрироваться
    </Button>
    <p className="cta-footnote">Без карты. Отмена в один клик.</p>
  </Container>
</div>

      {/* ПОДВАЛ */}
      <footer className="landing-footer">
        <Container>
          <Row className="align-items-center">
            <Col md={4} className="text-md-start text-center mb-3 mb-md-0">
              <span className="footer-brand">🧼 WashCRM</span>
            </Col>
            <Col md={4} className="text-center mb-3 mb-md-0">
              <small>© 2026 WashCRM. Все права защищены.</small>
            </Col>
            <Col md={4} className="text-md-end text-center">
              <small>Сделано для автомоек</small>
            </Col>
          </Row>
        </Container>
      </footer>

      <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <BiChevronUp />
      </button>
    </div>
  );
};

export default Landing;