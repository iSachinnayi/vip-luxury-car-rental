<?xml version="1.0" encoding="UTF-8"?>
<!-- XSL Stylesheet to transform sitemap XML into readable HTML -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

<xsl:output method="html" encoding="UTF-8" indent="yes"/>

<xsl:template match="/">
<html lang="en">
<head>
  <title>XML Sitemap | VIP Luxury Car Rental Dubai</title>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0A0A0A;
      color: #E5E5E5;
      padding: 40px 20px;
      line-height: 1.6;
    }
    .container { max-width: 900px; margin: 0 auto; }
    .header {
      background: linear-gradient(135deg, #C8A951 0%, #A8872F 100%);
      color: #0A0A0A;
      padding: 30px 40px;
      border-radius: 12px 12px 0 0;
    }
    .header h1 { font-size: 24px; font-weight: 700; }
    .header p { font-size: 14px; opacity: 0.8; margin-top: 6px; }
    .card {
      background: #151515;
      border: 1px solid #2A2A2A;
      border-top: none;
      padding: 20px 40px 30px;
    }
    .card:last-child { border-radius: 0 0 12px 12px; }
    .info { color: #999; font-size: 13px; padding: 15px 0 20px; }
    .info a { color: #C8A951; text-decoration: none; }
    .info a:hover { text-decoration: underline; }
    table { width: 100%; border-collapse: collapse; }
    th {
      text-align: left;
      padding: 14px 16px;
      font-size: 13px;
      font-weight: 600;
      color: #C8A951;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #2A2A2A;
    }
    td {
      padding: 12px 16px;
      font-size: 14px;
      border-bottom: 1px solid #222;
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba(200, 169, 81, 0.05); }
    .sitemap-link { color: #C8A951; text-decoration: none; font-weight: 500; }
    .sitemap-link:hover { text-decoration: underline; }
    .url-link { color: #7CB7FF; text-decoration: none; font-size: 13px; }
    .url-link:hover { text-decoration: underline; }
    .priority { color: #999; font-size: 12px; }
    .images-count { color: #6BBD6B; font-size: 12px; }
    .badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .badge-car { background: rgba(200, 169, 81, 0.15); color: #C8A951; }
    .badge-page { background: rgba(123, 183, 255, 0.15); color: #7CB7FF; }
    .badge-location { background: rgba(107, 189, 107, 0.15); color: #6BBD6B; }
    .badge-brand { background: rgba(200, 120, 200, 0.15); color: #C878C8; }
    .footer {
      text-align: center;
      padding: 30px;
      color: #666;
      font-size: 12px;
    }
    .footer a { color: #C8A951; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">

    <div class="header">
      <h1>XML Sitemap</h1>
      <p>This XML Sitemap is generated for VIP Luxury Car Rental Dubai. It helps search engines like Google crawl and index our content efficiently.</p>
    </div>

    <div class="card">
      <!-- Handle Sitemap Index (links to sub-sitemaps) -->
      <xsl:if test="sitemap:sitemapindex">
        <p class="info">
          This <strong>XML Sitemap Index</strong> file contains
          <strong><xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/></strong> sitemaps.
        </p>
        <table>
          <tr>
            <th>Sitemap</th>
            <th>Last Modified</th>
          </tr>
          <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
            <tr>
              <td>
                <a class="sitemap-link" href="{sitemap:loc}" target="_blank">
                  <xsl:value-of select="substring-after(sitemap:loc, 'vipluxurycarrental.com/')"/>
                </a>
              </td>
              <td>
                <xsl:value-of select="concat(substring(sitemap:lastmod, 9, 2), '/', substring(sitemap:lastmod, 6, 2), '/', substring(sitemap:lastmod, 1, 4))"/>
              </td>
            </tr>
          </xsl:for-each>
        </table>
      </xsl:if>

      <!-- Handle regular URLset (list of URLs) -->
      <xsl:if test="sitemap:urlset">
        <p class="info">
          This sitemap contains <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> URLs.
        </p>
        <table>
          <tr>
            <th>URL</th>
            <th>Priority</th>
            <th>Images</th>
          </tr>
          <xsl:for-each select="sitemap:urlset/sitemap:url">
            <tr>
              <td>
                <a class="url-link" href="{sitemap:loc}" target="_blank">
                  <xsl:value-of select="substring-after(sitemap:loc, 'vipluxurycarrental.com/')"/>
                </a>
                <xsl:if test="contains(sitemap:loc, '/car/')">
                  <span class="badge badge-car" style="margin-left: 8px;">Car</span>
                </xsl:if>
                <xsl:if test="contains(sitemap:loc, '/location/')">
                  <span class="badge badge-location" style="margin-left: 8px;">Location</span>
                </xsl:if>
                <xsl:if test="contains(sitemap:loc, '/rent-')">
                  <span class="badge badge-brand" style="margin-left: 8px;">Brand</span>
                </xsl:if>
                <xsl:if test="not(contains(sitemap:loc, '/car/') or contains(sitemap:loc, '/location/') or contains(sitemap:loc, '/rent-'))">
                  <span class="badge badge-page" style="margin-left: 8px;">Page</span>
                </xsl:if>
              </td>
              <td class="priority">
                <xsl:choose>
                  <xsl:when test="sitemap:priority > 0.7">High</xsl:when>
                  <xsl:when test="sitemap:priority > 0.5">Medium</xsl:when>
                  <xsl:otherwise>Standard</xsl:otherwise>
                </xsl:choose>
                (<xsl:value-of select="sitemap:priority"/>)
              </td>
              <td>
                <xsl:if test="image:image">
                  <span class="images-count">
                    <xsl:value-of select="count(image:image)"/> images
                  </span>
                </xsl:if>
                <xsl:if test="not(image:image)">—</xsl:if>
              </td>
            </tr>
          </xsl:for-each>
        </table>
      </xsl:if>
    </div>

    <div class="footer">
      Generated by VIP Luxury Car Rental Dubai |
      <a href="https://vipluxurycarrental.com/">Home</a> |
      <a href="https://vipluxurycarrental.com/sitemap/">HTML Sitemap</a>
    </div>

  </div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
