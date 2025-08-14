import React from "react";
import { Container, Row, Col, Image, Button, Card } from 'react-bootstrap';
import YAML from "yaml";
import AdPlaceholder from '../components/AdPlaceholder';

const rawPosts = import.meta.glob("../posts/*.md", { as: "raw", eager: true }) as Record<string, string>;

type Item = { slug: string; title: string; date?: string; description?: string };

function parseFrontmatter(raw: string) {
  if (!raw.startsWith("---")) return { content: raw, fm: {} as Record<string, unknown> };
  const match = raw.match(/^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*/);
  if (!match) return { content: raw, fm: {} as Record<string, unknown> };
  const fm = (YAML.parse(match[1]) ?? {}) as Record<string, unknown>;
  const content = raw.slice(match[0].length);
  return { content, fm };
}

const items: Item[] = Object.entries(rawPosts)
  .map(([path, raw]) => {
    const slug = path.split("/").pop()!.replace(".md", "");
    const { fm } = parseFrontmatter(raw);
    return {
      slug,
      title: String((fm as any).title ?? slug),
      date: (fm as any).date as string | undefined,
      description: (fm as any).description as string | undefined,
    };
  })
  .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

export default function Home() {
  return (
    <Container className="px-3 px-sm-4" style={{ maxWidth: '1400px' }}>
      {/* Top Banner Ad */}
      <div className="d-flex justify-content-center mb-4">
        <AdPlaceholder format="banner" />
      </div>
      

      <Row className="g-4">
        <Col lg={9}>
          {/* Hero Section */}
          <div className="mb-4 mb-lg-5">
            <h1 
              className="display-5 display-lg-4 fw-bold mb-3"
              style={{
                background: "linear-gradient(135deg, var(--bs-primary), var(--bs-info), var(--bs-secondary))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              That Labubu Life
            </h1>
            <p className="lead mb-5">
              New to Labubu or a lifelong fan? Welcome to the burrow — where curiosity meets chaos and every ear tells a story.
            </p>
            <Row className="align-items-center bg-light p-3 p-sm-4 rounded mb-4 mb-lg-5">
              <Col md={8}>
                <h2 className="h4 mb-3">Verify Your Labubu</h2>
                <p className="mb-3">Ensure your Labubu is authentic by checking its verification code on PopMart's official site.</p>
                <Button
                  href="https://www.popmart.com/us/help/authenticity-check"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  style={{
                    background: "linear-gradient(90deg, var(--bs-primary), var(--bs-info))",
                    border: "none"
                  }}
                >
                  Verify Authenticity
                </Button>
              </Col>
              <Col md={4} className="text-center">
                <Image 
                  src="/images/labubu-hero.png" 
                  alt="Mischievous Labubu" 
                  fluid
                  style={{ maxWidth: '200px' }}
                />
              </Col>
            </Row>
          </div>

          {/* Blog Posts */}
          <div className="blog-posts">
            {items.map((p, index) => (
              <Card 
                key={p.slug} 
                className={`mb-4 border-0 shadow-sm transition-all ${index % 2 === 0 ? '' : 'bg-light'}`}
                style={{
                  background: index % 2 === 0 ? 
                    'linear-gradient(135deg, rgba(255, 107, 156, 0.05), rgba(108, 223, 255, 0.05))' : 
                    'white'
                }}
              >
                <Card.Body className="p-4">
                  <a 
                    href={`/${p.slug}`} 
                    className="text-decoration-none"
                  >
                <Card.Title 
                  className="h5 h4-lg mb-2 mb-lg-3"
                      style={{
                        background: "linear-gradient(135deg, var(--bs-primary), var(--bs-info))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        transition: 'opacity 0.2s'
                      }}
                      onMouseOver={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.opacity = '0.8'}
                      onMouseOut={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.opacity = '1'}
                    >
                      {p.title}
                    </Card.Title>
                  </a>
                  {p.description && (
                    <Card.Text className="text-muted mb-2 mb-lg-3">
                      {p.description}
                    </Card.Text>
                  )}
                  <div className="d-flex flex-wrap align-items-center gap-2 gap-sm-3">
                    {p.date && (
                      <small className="text-muted d-flex align-items-center gap-1">
                        <i className="bi bi-calendar3"></i>
                        {p.date}
                      </small>
                    )}
                    <small className="text-muted d-flex align-items-center gap-1">
                      <i className="bi bi-clock"></i>
                      {Math.ceil(p.description?.length || 0 / 200)} min read
                    </small>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* Bottom Banner Ad */}
          <div className="d-flex justify-content-center my-5">
            <AdPlaceholder format="banner" />
          </div>
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
