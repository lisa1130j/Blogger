import React from "react";
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import AdPlaceholder from "./AdPlaceholder";

export type AccentColor =
  | "emerald"
  | "mint"
  | "teal"
  | "cyan"
  | "sky"
  | "rose"
  | "violet"
  | "indigo";

export interface LabubuAuthenticityGuideProps {
  accent?: AccentColor;
  className?: string;
}

interface ChecklistCardProps {
  title: string;
  desc: string;
  style?: React.CSSProperties;
}

const colorMap: Record<AccentColor, { text: string; border: string; bgSoft: string; button: string }> = {
  emerald: {
    text: "text-emerald-700",
    border: "border-emerald-600",
    bgSoft: "bg-emerald-50",
    button: "hover:bg-emerald-100",
  },
  mint: {
    text: "text-mint-700",
    border: "border-mint-600",
    bgSoft: "bg-mint-50",
    button: "hover:bg-mint-100",
  },
  teal: { text: "text-teal-700", border: "border-teal-600", bgSoft: "bg-teal-50", button: "hover:bg-teal-100" },
  cyan: { text: "text-cyan-700", border: "border-cyan-600", bgSoft: "bg-cyan-50", button: "hover:bg-cyan-100" },
  sky: { text: "text-sky-700", border: "border-sky-600", bgSoft: "bg-sky-50", button: "hover:bg-sky-100" },
  rose: { text: "text-rose-700", border: "border-rose-600", bgSoft: "bg-rose-50", button: "hover:bg-rose-100" },
  violet: { text: "text-violet-700", border: "border-violet-600", bgSoft: "bg-violet-50", button: "hover:bg-violet-100" },
  indigo: { text: "text-indigo-700", border: "border-indigo-600", bgSoft: "bg-indigo-50", button: "hover:bg-indigo-100" },
};

function ChecklistCard({ title, desc, style }: ChecklistCardProps) {
  return (
    <Card className="h-100 shadow-sm hover-shadow-lg transition-all" style={style}>
      <Card.Body>
        <Card.Title as="h3" className="h5">{title}</Card.Title>
        <Card.Text className="text-muted small">{desc}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default function LabubuAuthenticityGuide({
  accent = "emerald",
  className,
}: LabubuAuthenticityGuideProps) {
  const c = colorMap[accent] ?? colorMap.emerald;

  return (
    <Container fluid>
      <Row>
        <Col lg={9}>
          <section className={`py-5 ${className || ''}`} aria-labelledby="labubu-auth-title">
            {/* Top Banner Ad */}
            <div className="d-flex justify-content-center mb-4">
              <AdPlaceholder format="banner" />
            </div>

            <header className="text-center mb-4">
              <h1 
                id="labubu-auth-title" 
                className="display-5 fw-bold"
                style={{
                  background: "linear-gradient(135deg, var(--bs-primary), var(--bs-info), var(--bs-secondary))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                Labubu Authenticity Guide
              </h1>
              <p className="text-muted small">How to spot a genuine Pop Mart Labubu vs a counterfeit.</p>
            </header>

            {/* Two-up: Real vs Fake */}
            <Row className="g-4">
              {/* REAL */}
              <Col md={6}>
                <Card 
                  className="h-100 shadow-sm transition-all" 
                  style={{ 
                    borderColor: "var(--bs-primary)",
                    background: "linear-gradient(135deg, rgba(255, 107, 156, 0.1), rgba(108, 223, 255, 0.1))"
                  }}
                  aria-labelledby="real-heading"
                >
                  <Card.Body>
                    <Card.Title 
                      as="h2" 
                      id="real-heading" 
                      className="h4 text-primary"
                    >
                      REAL (Authentic)
                    </Card.Title>
                    <ListGroup variant="flush" className="small">
                      <ListGroup.Item>Matte, crisp packaging print; colors are not overly saturated.</ListGroup.Item>
                      <ListGroup.Item>Clean paint lines, correct facial proportions.</ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Exactly 9 teeth</strong> with sharp, even spacing.
                      </ListGroup.Item>
                      <ListGroup.Item>Smooth vinyl; seams are tight and consistent.</ListGroup.Item>
                      <ListGroup.Item>
                        Foot sole has a clear, precise <strong>POP MART</strong> imprint.
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Holographic/silver <strong>scratch-off QR sticker</strong> present.
                      </ListGroup.Item>
                      <ListGroup.Item>2024+ may show a small UV stamp on the right foot (blacklight).</ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>

              {/* FAKE */}
              <Col md={6}>
                <Card 
                  className="h-100 shadow-sm transition-all" 
                  style={{ 
                    borderColor: "var(--bs-danger)",
                    background: "linear-gradient(135deg, rgba(255, 82, 82, 0.1), rgba(255, 107, 156, 0.1))"
                  }}
                  aria-labelledby="fake-heading"
                >
                  <Card.Body>
                    <Card.Title 
                      as="h2" 
                      id="fake-heading" 
                      className="h4 text-danger"
                    >
                      FAKE (Counterfeit)
                    </Card.Title>
                    <ListGroup variant="flush" className="small">
                      <ListGroup.Item>Glossy or overly bright box; blurry edges in printing.</ListGroup.Item>
                      <ListGroup.Item>Uneven paint, off-model face/ears, sloppy seams.</ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Wrong tooth count</strong> (often 8 or 10) or rounded teeth.
                      </ListGroup.Item>
                      <ListGroup.Item>Plastic feels flimsy or overly shiny.</ListGroup.Item>
                      <ListGroup.Item>Foot logo missing, soft, or misaligned.</ListGroup.Item>
                      <ListGroup.Item>QR sticker missing, non-holographic, or redirects to unknown domain.</ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Quick Checklist */}
            <Row className="mt-5 g-4">
              <Col lg={4}>
                <ChecklistCard 
                  title="1) Box & Print" 
                  desc="Matte finish, soft colors, sharp lines. No spelling errors."
                  style={{
                    borderColor: "var(--bs-primary)",
                    background: "linear-gradient(135deg, rgba(255, 107, 156, 0.05), rgba(108, 223, 255, 0.05))"
                  }}
                />
              </Col>
              <Col lg={4}>
                <ChecklistCard 
                  title="2) Teeth & Sculpt" 
                  desc="Nine sharp teeth, correct proportions, clean seams."
                  style={{
                    borderColor: "var(--bs-secondary)",
                    background: "linear-gradient(135deg, rgba(156, 136, 255, 0.05), rgba(255, 184, 108, 0.05))"
                  }}
                />
              </Col>
              <Col lg={4}>
                <ChecklistCard 
                  title="3) Foot & Logos" 
                  desc="Crisp POP MART foot imprint; no smudging or drift."
                  style={{
                    borderColor: "var(--bs-info)",
                    background: "linear-gradient(135deg, rgba(108, 223, 255, 0.05), rgba(255, 107, 156, 0.05))"
                  }}
                />
              </Col>
            </Row>

            {/* QR Verification Steps */}
            <Card 
              className="mt-5"
              style={{
                borderColor: "var(--bs-primary)",
                background: "linear-gradient(135deg, rgba(255, 107, 156, 0.1), rgba(108, 223, 255, 0.1))"
              }}
            >
              <Card.Body>
                <Card.Title as="h3" className="text-primary">
                  Verify with the QR Sticker
                </Card.Title>
                <ListGroup variant="flush" className="small mt-3">
                  <ListGroup.Item>
                    1. Locate the <strong>holographic/silver scratch-off</strong> QR sticker (box or hang tag).
                  </ListGroup.Item>
                  <ListGroup.Item>
                    2. Scratch gently to reveal the code, then scan with your phone's camera.
                  </ListGroup.Item>
                  <ListGroup.Item>
                    3. Authentic results load on a Pop Mart domain (e.g., <code>popmart.com</code> / <code>m-gss.popmart.com</code>).
                  </ListGroup.Item>
                  <ListGroup.Item>
                    4. If it redirects elsewhere or fails to validate, treat as suspicious.
                  </ListGroup.Item>
                </ListGroup>
                <div className="mt-3">
                  <Button
                    href="https://www.popmart.com/us/help/authenticity-check"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    className="d-inline-flex align-items-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, var(--bs-primary), var(--bs-info))",
                      border: "none"
                    }}
                  >
                    Check Authenticity on Pop Mart →
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Trusted Buying Tips */}
            <Card 
              className="mt-5"
              style={{
                borderColor: "var(--bs-secondary)",
                background: "linear-gradient(135deg, rgba(156, 136, 255, 0.1), rgba(255, 184, 108, 0.1))"
              }}
            >
              <Card.Body>
                <Card.Title as="h3" className="text-secondary">
                  Trusted Buying Tips
                </Card.Title>
                <ListGroup variant="flush" className="small mt-3">
                  <ListGroup.Item>Best: Pop Mart official stores, website, or vending machines.</ListGroup.Item>
                  <ListGroup.Item>If reselling: ask for clear photos of the box, foot logo, and the intact QR sticker.</ListGroup.Item>
                  <ListGroup.Item>Request live verification (seller scratches & scans on video).</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>

            {/* Comparison Image */}
            <div className="text-center mt-5">
              <h3 
                className="h4 mb-4"
                style={{
                  background: "linear-gradient(135deg, var(--bs-primary), var(--bs-info))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                Can you spot the real one?
              </h3>
              <Card className="border-0 shadow-lg mx-auto" style={{ maxWidth: '800px' }}>
                <Card.Img 
                  src="/images/labubu-compare.jpg" 
                  alt="Labubu Comparison Guide"
                  className="rounded"
                />
              </Card>
            </div>
          </section>
        </Col>
        <Col lg={3} className="mt-5">
          <div className="sticky-top" style={{ top: '6rem' }}>
            <AdPlaceholder format="sidebar" />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
