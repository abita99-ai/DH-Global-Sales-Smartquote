# -*- coding: utf-8 -*-
import sys
import os
import math
from PIL import Image, ImageDraw, ImageFont

def generate_flowchart():
    # Set up canvas (2x High Resolution)
    W, H = 1800, 2220
    bg_color = (255, 255, 255)
    img = Image.new('RGB', (W, H), bg_color)
    draw = ImageDraw.Draw(img)

    # Fonts
    font_title = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 26)
    font_sec_title = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 19)
    font_box_title = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 16)
    font_box_text = ImageFont.truetype('C:/Windows/Fonts/malgun.ttf', 14)
    font_box_text_bold = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 14)
    font_small = ImageFont.truetype('C:/Windows/Fonts/malgun.ttf', 12)
    font_small_bold = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 13)

    # Colors
    C_BORDER = (100, 116, 139)
    C_BOX_BORDER = (148, 163, 184)
    C_BOX_BG = (248, 250, 252)
    C_BOX_HIGHLIGHT = (240, 249, 255)
    C_BOX_ACCENT = (254, 243, 199)
    C_AGENT_BG = (245, 243, 255)
    C_AGENT_BORDER = (168, 85, 247)
    C_LINE = (37, 99, 235)
    C_DASH_LINE = (156, 163, 175)
    C_TEXT = (30, 41, 59)
    C_TEXT_MUTED = (100, 116, 139)
    C_HEADER_BG = (241, 245, 249)

    def draw_rounded_box(draw, xy, fill, outline, width=2, radius=8):
        draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

    def draw_text_centered(draw, text, box_xy, font, fill=C_TEXT, spacing=5):
        x0, y0, x1, y1 = box_xy
        lines = text.split('\n')
        line_sizes = [draw.textbbox((0, 0), line, font=font) for line in lines]
        total_h = sum(b[3] - b[1] for b in line_sizes) + (len(lines) - 1) * spacing
        cur_y = y0 + (y1 - y0 - total_h) / 2
        for i, line in enumerate(lines):
            w = line_sizes[i][2] - line_sizes[i][0]
            cur_x = x0 + (x1 - x0 - w) / 2
            draw.text((cur_x, cur_y), line, font=font, fill=fill)
            cur_y += (line_sizes[i][3] - line_sizes[i][1]) + spacing

    def draw_arrow(draw, start, end, color=C_LINE, width=2, arrow_size=9, dashed=False):
        x0, y0 = start
        x1, y1 = end
        if dashed:
            dist = math.hypot(x1 - x0, y1 - y0)
            dash_len = 6
            space_len = 4
            num_dashes = int(dist // (dash_len + space_len))
            for i in range(num_dashes + 1):
                s = i * (dash_len + space_len) / dist
                e = min((i * (dash_len + space_len) + dash_len) / dist, 1.0)
                sx, sy = x0 + (x1 - x0) * s, y0 + (y1 - y0) * s
                ex, ey = x0 + (x1 - x0) * e, y0 + (y1 - y0) * e
                draw.line([(sx, sy), (ex, ey)], fill=color, width=width)
        else:
            draw.line([start, end], fill=color, width=width)
        
        angle = math.atan2(y1 - y0, x1 - x0)
        p1 = (x1 - arrow_size * math.cos(angle - math.pi / 6),
              y1 - arrow_size * math.sin(angle - math.pi / 6))
        p2 = (x1 - arrow_size * math.cos(angle + math.pi / 6),
              y1 - arrow_size * math.sin(angle + math.pi / 6))
        draw.polygon([end, p1, p2], fill=color)

    # Header Title Area
    draw.text((80, 35), "DAIHAN Scientific Global B2B Sales Online - System Flowchart", font=font_title, fill=(15, 23, 42))
    draw.text((80, 75), "Updated v2.0 Architecture: Multi-path Search | Zero Spec Error | Dual Push (Kakao + Telegram) | Agent CRM", font=font_box_text, fill=C_TEXT_MUTED)

    # -------------------------------------------------------------
    # SECTION 1: Front-end Experience
    # -------------------------------------------------------------
    sec1_y0, sec1_y1 = 110, 1080
    draw_rounded_box(draw, (60, sec1_y0, W - 60, sec1_y1), fill=(255, 255, 255), outline=C_BORDER, width=2, radius=10)
    
    # Section 1 Header Tab
    draw_rounded_box(draw, (60, sec1_y0, W - 60, sec1_y0 + 40), fill=C_HEADER_BG, outline=C_BORDER, width=2, radius=10)
    draw.rectangle((60, sec1_y0 + 20, W - 60, sec1_y0 + 40), fill=C_HEADER_BG)
    draw.line([(60, sec1_y0 + 40), (W - 60, sec1_y0 + 40)], fill=C_BORDER, width=2)
    draw.text((80, sec1_y0 + 8), "1. 글로벌 바이어 & 공식 대리점 프론트엔드 경험 (Front-end Experience)", font=font_sec_title, fill=(30, 41, 59))

    # User Entry Box
    entry_box = (450, 170, 1350, 225)
    draw_rounded_box(draw, entry_box, fill=C_BOX_BG, outline=C_BOX_BORDER, radius=6)
    draw_text_centered(draw, "바이어 & 대리점 포털 유입 (영문 기본 / 다국어 i18n 확장 뼈대 / PWA 지원)", entry_box, font_box_text)

    # Auth Split Decision Box (Diamond)
    d_cx, d_cy, d_w, d_h = 900, 285, 220, 52
    diamond_pts = [(d_cx, d_cy - d_h//2), (d_cx + d_w//2, d_cy), (d_cx, d_cy + d_h//2), (d_cx - d_w//2, d_cy)]
    draw.polygon(diamond_pts, fill=(240, 249, 255), outline=C_BOX_BORDER)
    draw_text_centered(draw, "사용자 구분 / 인증", (d_cx - d_w//2, d_cy - d_h//2, d_cx + d_w//2, d_cy + d_h//2), font_box_title, fill=(3, 105, 161))

    draw_arrow(draw, (900, 225), (900, d_cy - d_h//2))

    # Left Track: Guest Buyer / Right Track: Authorized Agent
    draw.line([(d_cx - d_w//2, d_cy), (490, d_cy)], fill=C_LINE, width=2)
    draw_arrow(draw, (490, d_cy), (490, 350))
    draw.text((250, d_cy - 22), "일반 바이어 (가격 비공개)", font=font_small_bold, fill=(2, 132, 199))

    draw.line([(d_cx + d_w//2, d_cy), (1380, d_cy)], fill=(147, 51, 234), width=2)
    draw_arrow(draw, (1380, d_cy), (1380, 350), color=(147, 51, 234))
    draw.text((1050, d_cy - 22), "사전 승인 공식 대리점 로그인", font=font_small_bold, fill=(147, 51, 234))

    # Left: 4 Paths
    p_y0, p_y1 = 350, 435
    paths = [
        ("경로 1\n카테고리 / 기기군별 탐색", (90, p_y0, 275, p_y1)),
        ("경로 2\n실험 / 연구 목적별 탐색", (295, p_y0, 480, p_y1)),
        ("경로 3\n모델명 검색 / 2026 신제품", (500, p_y0, 685, p_y1)),
        ("경로 4\n2026 e-카탈로그 PDF 뷰어", (705, p_y0, 890, p_y1))
    ]
    for title, box in paths:
        draw_rounded_box(draw, box, fill=C_BOX_BG, outline=C_BOX_BORDER, radius=6)
        draw_text_centered(draw, title, box, font_box_text)

    # Right: Agent Track Box
    agent_box = (1100, 350, 1660, 435)
    draw_rounded_box(draw, agent_box, fill=C_AGENT_BG, outline=C_AGENT_BORDER, radius=6)
    draw_text_centered(draw, "공식 대리점 전용 대시보드\n(계약 공급가/할인율 열람 | 1-Click 재견적/재발주 | 인증서 다운로드)", agent_box, font_box_text, fill=(88, 28, 135))

    # Spec Sheet Box (Convergence)
    spec_box = (320, 510, 1480, 580)
    draw_rounded_box(draw, spec_box, fill=(238, 242, 255), outline=(99, 102, 241), width=2, radius=8)
    draw_text_centered(draw, "단일 표준 [최종 스펙 확정 시트] (Final Spec Confirmation Sheet)\n※ 모든 탐색 경로 및 대리점 발주의 공통 종착지 (Zero Spec Error Gatekeeper)", spec_box, font_box_title, fill=(49, 46, 129))

    # Draw convergence arrows from 4 paths & agent box to spec_box
    for _, box in paths:
        bx_center = (box[0] + box[2]) // 2
        draw.line([(bx_center, p_y1), (bx_center, 470)], fill=C_LINE, width=2)
    draw.line([(paths[0][1][0] + paths[0][1][2])//2, 470, (paths[3][1][0] + paths[3][1][2])//2, 470], fill=C_LINE, width=2)
    draw_arrow(draw, (490, 470), (490, 510))

    draw.line([(1380, p_y1), (1380, 470)], fill=(168, 85, 247), width=2)
    draw.line([(1380, 470), (1310, 470)], fill=(168, 85, 247), width=2)
    draw_arrow(draw, (1310, 470), (1310, 510), color=(168, 85, 247))

    # 3-Step Verification Box
    verif_box = (200, 630, 1600, 765)
    draw_rounded_box(draw, verif_box, fill=C_BOX_HIGHLIGHT, outline=C_LINE, width=2, radius=8)
    verif_text = "■ 스펙 3단계 검증 프로세스 (Zero Specification Error)\n" \
                 "① 고정 스펙 검증: 본체 기본 사양 확인 + \"I have verified base specifications\" 체크박스 (필수 체크 후 담기 활성화)\n" \
                 "② 가변 옵션 선택: 전압(230V vs 120V) & 국가별 플러그 규격(Type C/G/B) & 100% 호환 부속품(Accessories) 선택\n" \
                 "③ 예상 운임 사전 고지: \"최종 주문 수량 및 패킹(CBM/Weight) 확정 후 산출되어 공식 견적서에 포함됩니다\" 안내 명시"
    draw_text_centered(draw, verif_text, verif_box, font_box_text, fill=(15, 23, 42), spacing=6)

    draw_arrow(draw, (900, 580), (900, 630))

    # RFQ Submission Box
    rfq_box = (300, 825, 1500, 930)
    draw_rounded_box(draw, rfq_box, fill=C_BOX_ACCENT, outline=(217, 119, 6), width=2, radius=8)
    rfq_text = "스마트 RFQ 장바구니 담기 & 제출 (Smart RFQ Submission)\n" \
               "• 필수 입력 항목: 회사명(Company), 국가(Country - 필수), 도시(City - 필수), 이메일(Email)\n" \
               "• 필수 안내 문구 표출: \"Your inquiry will be promptly handled by the nearest authorized DAIHAN distributor/partner.\""
    draw_text_centered(draw, rfq_text, rfq_box, font_box_text, fill=(120, 53, 15), spacing=5)

    draw_arrow(draw, (900, 765), (900, 825))

    # -------------------------------------------------------------
    # SECTION 2: Back-end Automation
    # -------------------------------------------------------------
    sec2_y0, sec2_y1 = 1130, 1725
    draw_rounded_box(draw, (60, sec2_y0, W - 60, sec2_y1), fill=(255, 255, 255), outline=C_BORDER, width=2, radius=10)
    
    # Section 2 Header Tab
    draw_rounded_box(draw, (60, sec2_y0, W - 60, sec2_y0 + 40), fill=C_HEADER_BG, outline=C_BORDER, width=2, radius=10)
    draw.rectangle((60, sec2_y0 + 20, W - 60, sec2_y0 + 40), fill=C_HEADER_BG)
    draw.line([(60, sec2_y0 + 40), (W - 60, sec2_y0 + 40)], fill=C_BORDER, width=2)
    draw.text((80, sec2_y0 + 8), "2. 영업 담당자 초고속 대응 파이프라인 (Back-end Automation & Dual Push)", font=font_sec_title, fill=(30, 41, 59))

    # Connecting Arrow between Sec 1 and Sec 2
    draw_arrow(draw, (900, 930), (900, 1180), width=3, arrow_size=10)

    # Cloud DB Store Box
    db_box = (500, 1180, 1300, 1245)
    draw_rounded_box(draw, db_box, fill=(240, 253, 244), outline=(34, 197, 94), width=2, radius=6)
    draw_text_centered(draw, "클라우드 DB (Supabase / Firebase) 1차 안전 영구 저장\n(동시 접속 및 트래픽 폭주 시 견적 데이터 유실 0% 보장)", db_box, font_box_text, fill=(20, 83, 45))

    # Branch Left: Buyer Auto-email / Branch Right: Google Sheets API
    buyer_mail_box = (100, 1290, 680, 1365)
    draw_rounded_box(draw, buyer_mail_box, fill=C_BOX_BG, outline=C_BOX_BORDER, radius=6)
    draw_text_centered(draw, "바이어: 공식 접수 확인 이메일 자동 발송\n(요청 스펙 요약서 첨부 & 현지 공인 대리점 대응 안내)", buyer_mail_box, font_box_text)

    sheets_box = (900, 1290, 1700, 1365)
    draw_rounded_box(draw, sheets_box, fill=(236, 253, 245), outline=(16, 185, 129), width=2, radius=6)
    draw_text_centered(draw, "구글 스프레드시트 API 실시간 1행 동기화 (2초 이내)\n(바이어 정보, 국가/도시, 모델명, 전압, 플러그, 수량 자동 행 추가)", sheets_box, font_box_text, fill=(6, 78, 59))

    draw_arrow(draw, (700, 1245), (390, 1290))
    draw_arrow(draw, (1100, 1245), (1300, 1290))

    # Dual Push Notifications (Kakao Alimtalk + Telegram Bot)
    kakao_box = (920, 1420, 1280, 1495)
    draw_rounded_box(draw, kakao_box, fill=(254, 249, 195), outline=(234, 179, 8), width=2, radius=6)
    draw_text_centered(draw, "카카오톡 알림톡 즉시 도착\n(국내 담당자 스마트폰 비즈니스 알림)", kakao_box, font_box_text, fill=(113, 63, 18))

    tg_box = (1340, 1420, 1700, 1495)
    draw_rounded_box(draw, tg_box, fill=(224, 242, 254), outline=(14, 165, 233), width=2, radius=6)
    draw_text_centered(draw, "텔레그램 봇 실시간 푸시 발송\n(해외영업 그룹/개인 봇 상세 알림)", tg_box, font_box_text, fill=(3, 105, 161))

    draw_arrow(draw, (1100, 1365), (1100, 1420))
    draw_arrow(draw, (1520, 1365), (1520, 1420))

    # Sales Rep Outlook Reply Box
    outlook_box = (920, 1560, 1700, 1655)
    draw_rounded_box(draw, outlook_box, fill=(239, 246, 255), outline=(59, 130, 246), width=2, radius=8)
    draw_text_centered(draw, "영업 담당자 스펙 확인 및 정식 견적서 직접 회신\n• 정제된 엑셀/텍스트 데이터 기반 사내 공식 이메일(Outlook)로 바이어에게 직접 발송\n• 구글 시트 상태값 [진행중 ➔ 견적완료 ➔ 수주] 업데이트", outlook_box, font_box_text, fill=(30, 58, 138), spacing=4)

    draw.line([(1100, 1495), (1100, 1530)], fill=C_LINE, width=2)
    draw.line([(1520, 1495), (1520, 1530)], fill=C_LINE, width=2)
    draw.line([(1100, 1530), (1520, 1530)], fill=C_LINE, width=2)
    draw_arrow(draw, (1310, 1530), (1310, 1560))

    # -------------------------------------------------------------
    # SECTION 3: CRM & Analytics
    # -------------------------------------------------------------
    sec3_y0, sec3_y1 = 1775, 2145
    draw_rounded_box(draw, (60, sec3_y0, W - 60, sec3_y1), fill=(255, 255, 255), outline=C_BORDER, width=2, radius=10)
    
    # Section 3 Header Tab
    draw_rounded_box(draw, (60, sec3_y0, W - 60, sec3_y0 + 40), fill=C_HEADER_BG, outline=C_BORDER, width=2, radius=10)
    draw.rectangle((60, sec3_y0 + 20, W - 60, sec3_y0 + 40), fill=C_HEADER_BG)
    draw.line([(60, sec3_y0 + 40), (W - 60, sec3_y0 + 40)], fill=C_BORDER, width=2)
    draw.text((80, sec3_y0 + 8), "3. 영업 CRM & 데이터 자산화 (Analytics, Intelligence & Scale)", font=font_sec_title, fill=(30, 41, 59))

    # Connecting line from Outlook update to CRM
    draw_arrow(draw, (1310, 1655), (1310, 1835), width=2, arrow_size=8)
    # Connecting line from DB to Phase 2
    draw_arrow(draw, (190, 1245), (190, 1835), color=C_DASH_LINE, width=2, dashed=True)

    # 4 Bottom CRM Boxes
    crm_w = 385
    crm_h = 135
    crm_y0 = 1835
    crm_boxes = [
        ("본사 ERP / 3D 이미지 연동\n(Phase 2 확장 계획)\n\n• 실시간 재고/원가 API 연동\n• 고화질 3D/렌더링 DB 고도화", (85, crm_y0, 85 + crm_w, crm_y0 + crm_h), True),
        ("이메일 기반 히스토리 통합\n(Lead Aggregation)\n\n• 바이어 이메일 기준 과거 문의 매핑\n• 동일 바이어/대리점 재인입 감지", (500, crm_y0, 500 + crm_w, crm_y0 + crm_h), False),
        ("국가/바이어 자동 태깅\n(Lead Qualification)\n\n• [유럽_대리점], [미주_연구소] 태깅\n• 2026 신제품 타깃 마케팅 연계", (915, crm_y0, 915 + crm_w, crm_y0 + crm_h), False),
        ("구글 룩커 스튜디오 BI\n(Live Dashboard)\n\n• 국가/도시별 견적 인입 실시간 지도\n• 최다 요청 TOP 10 / 전압별(230/120V) 분석", (1330, crm_y0, 1330 + crm_w, crm_y0 + crm_h), False)
    ]

    for title, box, is_phase2 in crm_boxes:
        if is_phase2:
            draw_rounded_box(draw, box, fill=(249, 250, 251), outline=(156, 163, 175), radius=6)
            draw_text_centered(draw, title, box, font_small, fill=C_TEXT_MUTED)
        else:
            draw_rounded_box(draw, box, fill=(240, 249, 255), outline=(56, 189, 248), width=2, radius=6)
            draw_text_centered(draw, title, box, font_box_text, fill=(12, 74, 110))

    # Distribute sync line from CRM line
    draw.line([(500 + crm_w//2, 1800), (1330 + crm_w//2, 1800)], fill=C_LINE, width=2)
    draw_arrow(draw, (500 + crm_w//2, 1800), (500 + crm_w//2, crm_y0))
    draw_arrow(draw, (915 + crm_w//2, 1800), (915 + crm_w//2, crm_y0))
    draw_arrow(draw, (1330 + crm_w//2, 1800), (1330 + crm_w//2, crm_y0))

    # Save output
    output_path = "Updated Flow chart plan_Global Sales online.png"
    img.save(output_path, "PNG", quality=95)
    print(f"Successfully generated and saved: {output_path}")

if __name__ == "__main__":
    generate_flowchart()
