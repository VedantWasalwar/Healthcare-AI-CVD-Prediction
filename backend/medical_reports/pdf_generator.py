import os
import uuid
from datetime import datetime
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
from reportlab.pdfgen import canvas

from recommendations.engine import RecommendationEngine
from recommendations.models import Recommendation

class NumberedCanvas(canvas.Canvas):
    """Canvas wrapper for adding page numbers and running footer"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Footer text & page numbers
        footer_text = "HeartCare AI — Transparent AI & Cardiovascular Risk Assessment Report"
        page_text = f"Page {self._pageNumber} of {page_count}"
        
        self.drawString(36, 25, footer_text)
        self.drawRightString(A4[0] - 36, 25, page_text)
        
        # Thin divider line above footer
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(36, 38, A4[0] - 36, 38)
        
        self.restoreState()

class PDFReportGenerator:
    """
    ReportLab PDF Generation Engine for HeartCare AI.
    Generates professional, publication-quality A4 medical assessment reports with
    dark underline highlighting, local SHAP explanations, counterfactual AI scenarios,
    and research audit metadata.
    """

    @staticmethod
    def generate_prediction_report(prediction_obj, user) -> tuple:
        media_dir = os.path.join('media', 'pdf_reports')
        os.makedirs(media_dir, exist_ok=True)

        report_id_str = f"HC-RPT-{prediction_obj.created_at.strftime('%Y%m%d')}-{prediction_obj.id:04d}"
        filename = f"HeartCare_Report_{report_id_str}.pdf"
        file_path = os.path.join(media_dir, filename)

        doc = SimpleDocTemplate(
            file_path,
            pagesize=A4,
            leftMargin=36,
            rightMargin=36,
            topMargin=36,
            bottomMargin=54
        )

        styles = getSampleStyleSheet()

        # Custom Styles
        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            textColor=colors.HexColor('#0D47A1')
        )

        subtitle_style = ParagraphStyle(
            'ReportSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=11,
            leading=14,
            textColor=colors.HexColor('#64748B')
        )

        section_heading = ParagraphStyle(
            'SectionHeading',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=14,
            leading=18,
            textColor=colors.HexColor('#1E293B'),
            spaceBefore=14,
            spaceAfter=8
        )

        body_style = ParagraphStyle(
            'ReportBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=13,
            textColor=colors.HexColor('#334155')
        )

        disclaimer_style = ParagraphStyle(
            'DisclaimerText',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=9,
            leading=13,
            textColor=colors.HexColor('#92400E')
        )

        story = []

        # 1. HEADER SECTION
        story.append(Paragraph("HEARTCARE AI", title_style))
        story.append(Paragraph("Transparent AI Cardiovascular Risk Assessment Report", subtitle_style))
        story.append(Spacer(1, 10))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0D47A1'), spaceBefore=2, spaceAfter=12))

        # 2. PATIENT & REPORT METADATA TABLE
        created_str = prediction_obj.created_at.strftime("%d %b %Y, %H:%M")
        meta = prediction_obj.model_metadata or {}
        meta_data = [
            [
                Paragraph("<b>Report ID:</b> " + report_id_str, body_style),
                Paragraph("<b>Assessment Date:</b> " + created_str, body_style)
            ],
            [
                Paragraph("<b>User Identifier:</b> " + user.username, body_style),
                Paragraph(f"<b>Model Engine:</b> {prediction_obj.model_version} (XGBoost + SHAP)", body_style)
            ],
            [
                Paragraph("<b>Dataset:</b> 70,000 Verified Patient Records", body_style),
                Paragraph("<b>Model Performance:</b> ROC-AUC 0.8007 | Acc 73.46%", body_style)
            ]
        ]
        meta_table = Table(meta_data, colWidths=[260, 260])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(meta_table)
        story.append(Spacer(1, 14))

        # 3. AI CARDIOVASCULAR RISK ASSESSMENT SUMMARY CARD
        risk_level = prediction_obj.risk_level
        risk_pct = prediction_obj.risk_percentage
        
        if risk_level == 'LOW':
            badge_bg = colors.HexColor('#DCFCE7')
            badge_fg = colors.HexColor('#15803D')
        elif risk_level == 'MODERATE':
            badge_bg = colors.HexColor('#FEF3C7')
            badge_fg = colors.HexColor('#B45309')
        elif risk_level == 'HIGH':
            badge_bg = colors.HexColor('#FEE2E2')
            badge_fg = colors.HexColor('#B91C1C')
        else: # VERY HIGH
            badge_bg = colors.HexColor('#7F1D1D')
            badge_fg = colors.white

        summary_html = f"""
        <b>Calculated CVD Risk Score:</b> <font size=16 color="{badge_fg.hexval()}"><b>{risk_pct:.1f}%</b></font> &nbsp;&nbsp;&nbsp;&nbsp; 
        <b>Risk Probability:</b> {prediction_obj.risk_probability:.4f} &nbsp;&nbsp;&nbsp;&nbsp;
        <b>Risk Category:</b> <font color="{badge_fg.hexval()}"><b><u>{risk_level}</u></b></font>
        """
        
        summary_table = Table([[Paragraph(summary_html, body_style)]], colWidths=[520])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), badge_bg),
            ('BOX', (0,0), (-1,-1), 1.5, badge_fg),
            ('PADDING', (0,0), (-1,-1), 10),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ]))
        
        story.append(Paragraph("AI Risk Assessment Result", section_heading))
        story.append(summary_table)
        story.append(Spacer(1, 14))

        # 4. HEALTH PARAMETERS TABLE WITH DARK UNDERLINE HIGHLIGHTS
        story.append(Paragraph("Clinical Parameter Comparison (Dark Underline = High Risk Factor)", section_heading))
        features = prediction_obj.input_features or {}
        
        gender_str = "Male" if features.get('gender') == 2 else "Female"
        
        ap_hi = features.get('ap_hi', 0)
        ap_lo = features.get('ap_lo', 0)
        bmi = features.get('bmi', 0)
        chol = features.get('cholesterol', 1)
        gluc = features.get('gluc', 1)
        smoke = features.get('smoke', 0)

        # Build Underlined Cells for High Risk
        bp_cell = f"<u><font color='#B91C1C'><b>{ap_hi} / {ap_lo} mmHg [HIGH]</b></font></u>" if (ap_hi >= 130 or ap_lo >= 90) else f"{ap_hi} / {ap_lo} mmHg"
        bmi_cell = f"<u><font color='#B91C1C'><b>{bmi:.1f} kg/m² [OBESE]</b></font></u>" if bmi >= 30 else f"{bmi:.1f} kg/m²"
        
        chol_str = "1 (Normal)" if chol == 1 else ("2 (Above Normal)" if chol == 2 else "3 (High)")
        chol_cell = f"<u><font color='#B91C1C'><b>{chol_str} [HIGH RISK]</b></font></u>" if chol >= 2 else chol_str

        gluc_str = "1 (Normal)" if gluc == 1 else ("2 (Above Normal)" if gluc == 2 else "3 (High)")
        gluc_cell = f"<u><font color='#B91C1C'><b>{gluc_str} [ELEVATED]</b></font></u>" if gluc >= 2 else gluc_str

        smoke_cell = f"<u><font color='#B91C1C'><b>Active Smoker [HIGH RISK FACTOR]</b></font></u>" if smoke == 1 else "Non-Smoker"
        
        param_data = [
            [Paragraph("<b>Parameter</b>", body_style), Paragraph("<b>Recorded Patient Value</b>", body_style), Paragraph("<b>Clinical Status / Reference</b>", body_style)],
            [Paragraph("Age", body_style), Paragraph(f"{features.get('age', 'N/A')} years", body_style), Paragraph("Adult", body_style)],
            [Paragraph("Gender", body_style), Paragraph(gender_str, body_style), Paragraph("-", body_style)],
            [Paragraph("Height / Weight", body_style), Paragraph(f"{features.get('height', 'N/A')} cm / {features.get('weight', 'N/A')} kg", body_style), Paragraph(bmi_cell, body_style)],
            [Paragraph("Blood Pressure", body_style), Paragraph(bp_cell, body_style), Paragraph("Systolic <120 / Diastolic <80", body_style)],
            [Paragraph("Cholesterol", body_style), Paragraph(chol_cell, body_style), Paragraph("1 (Normal) - 3 (High)", body_style)],
            [Paragraph("Glucose", body_style), Paragraph(gluc_cell, body_style), Paragraph("1 (Normal) - 3 (High)", body_style)],
            [Paragraph("Smoking Habit", body_style), Paragraph(smoke_cell, body_style), Paragraph("Lifestyle Factor", body_style)],
            [Paragraph("Alcohol Intake", body_style), Paragraph("Yes" if features.get('alco') == 1 else "No", body_style), Paragraph("Lifestyle Factor", body_style)],
            [Paragraph("Physical Activity", body_style), Paragraph("Yes" if features.get('active') == 1 else "No", body_style), Paragraph("Regular Activity", body_style)],
        ]
        
        param_table = Table(param_data, colWidths=[160, 180, 180])
        param_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0D47A1')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#94A3B8')),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(param_table)
        story.append(Spacer(1, 14))

        # 5. SHAP FEATURE EXPLANATION TABLE
        story.append(Paragraph("SHAP Model Risk Drivers (Local Feature Importance)", section_heading))
        story.append(Paragraph("<i>Note: SHAP values quantify how much each specific feature increased or decreased the XGBoost model's risk score for this prediction.</i>", subtitle_style))
        story.append(Spacer(1, 6))

        top_factors = prediction_obj.top_risk_factors or []
        shap_data = [
            [Paragraph("<b>Feature Factor</b>", body_style), Paragraph("<b>SHAP Contribution</b>", body_style), Paragraph("<b>Model Influence Direction</b>", body_style)]
        ]
        
        if not top_factors:
            shap_data.append([Paragraph("No significant risk-increasing factors", body_style), Paragraph("0.0000", body_style), Paragraph("Neutral", body_style)])
        else:
            for factor in top_factors:
                f_name = factor.get('human_name', factor.get('feature', 'N/A'))
                f_val = factor.get('contribution', factor.get('shap_value', 0.0))
                f_dir = "<u><font color='#B91C1C'><b>Increases Risk</b></font></u>" if factor.get('direction') == 'increases_risk' else "<font color='#15803D'>Decreases Risk</font>"
                shap_data.append([
                    Paragraph(f_name, body_style),
                    Paragraph(f"{f_val:+.4f}", body_style),
                    Paragraph(f_dir, body_style)
                ])

        shap_table = Table(shap_data, colWidths=[180, 140, 200])
        shap_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#334155')),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#94A3B8')),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(shap_table)
        story.append(Spacer(1, 14))

        # 6. COUNTERFACTUAL HYPOTHETICAL SCENARIO TABLE (Section 32.28)
        counterfactual = prediction_obj.counterfactual_scenario or {}
        if counterfactual and counterfactual.get('changed_variables'):
            story.append(Paragraph("Actionable Counterfactual AI Scenario (Hypothetical Model Simulation)", section_heading))
            story.append(Paragraph("<i>Notice: This hypothetical model scenario illustrates how modifying actionable lifestyle/clinical parameters could impact model-predicted risk. This is NOT a medical prescription or guaranteed outcome.</i>", subtitle_style))
            story.append(Spacer(1, 6))

            cf_delta = counterfactual.get('risk_delta_percentage', 0.0)
            cf_hypo_pct = counterfactual.get('hypothetical_risk_percentage', 0.0)
            cf_hypo_lvl = counterfactual.get('hypothetical_risk_level', 'LOW')

            cf_summary_html = f"""
            <b>Current Model Risk:</b> {risk_pct:.1f}% ({risk_level}) &nbsp;&nbsp;➔&nbsp;&nbsp; 
            <b>Hypothetical Risk:</b> <font color="#15803D"><b>{cf_hypo_pct:.1f}% ({cf_hypo_lvl})</b></font> &nbsp;&nbsp;|&nbsp;&nbsp; 
            <b>Potential Model Risk Reduction:</b> <font color="#15803D"><b>-{cf_delta:.1f}%</b></font>
            """
            
            cf_summary_table = Table([[Paragraph(cf_summary_html, body_style)]], colWidths=[520])
            cf_summary_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F0FDF4')),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#86EFAC')),
                ('PADDING', (0,0), (-1,-1), 8),
            ]))
            story.append(cf_summary_table)
            story.append(Spacer(1, 8))

            cf_table_data = [
                [Paragraph("<b>Actionable Parameter</b>", body_style), Paragraph("<b>Current Assessment</b>", body_style), Paragraph("<b>Hypothetical Target</b>", body_style), Paragraph("<b>Direction</b>", body_style)]
            ]
            for item in counterfactual.get('changed_variables', []):
                cf_table_data.append([
                    Paragraph(item.get('variable', 'N/A'), body_style),
                    Paragraph(item.get('current', 'N/A'), body_style),
                    Paragraph(item.get('hypothetical', 'N/A'), body_style),
                    Paragraph(f"<font color='#15803D'><b>{item.get('direction', 'Improved')}</b></font>", body_style)
                ])

            cf_table = Table(cf_table_data, colWidths=[140, 130, 140, 110])
            cf_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#065F46')),
                ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#A7F3D0')),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#34D399')),
                ('PADDING', (0,0), (-1,-1), 6),
            ]))
            story.append(cf_table)
            story.append(Spacer(1, 14))

        # 7. PERSONALIZED RECOMMENDATIONS TABLE
        story.append(Paragraph("Personalized Non-Pharmacological Guidance", section_heading))
        
        recs = Recommendation.objects.filter(user=user, prediction=prediction_obj)
        if not recs.exists():
            result = RecommendationEngine.generate_recommendations(prediction_obj)
            for r_dict in result['recommendations']:
                Recommendation.objects.create(
                    user=user,
                    prediction=prediction_obj,
                    category=r_dict['category'],
                    priority=r_dict['priority'],
                    title=r_dict['title'],
                    message=r_dict['message'],
                    reason=r_dict['reason']
                )
            recs = Recommendation.objects.filter(user=user, prediction=prediction_obj)

        rec_data = [
            [Paragraph("<b>Category & Priority</b>", body_style), Paragraph("<b>Recommendation Guidance</b>", body_style)]
        ]
        
        for r in recs:
            rec_data.append([
                Paragraph(f"<b>{r.category}</b><br/><font color='#0D47A1'>[{r.priority} Priority]</font>", body_style),
                Paragraph(f"<b>{r.title}</b><br/>{r.message}", body_style)
            ])

        rec_table = Table(rec_data, colWidths=[160, 360])
        rec_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0D47A1')),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#94A3B8')),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(rec_table)
        story.append(Spacer(1, 16))

        # 8. PROMINENT MEDICAL DISCLAIMER BOX
        disclaimer_box_data = [[
            Paragraph(
                "<b>IMPORTANT MEDICAL SAFETY DISCLAIMER:</b><br/>"
                "This report provides an AI-assisted cardiovascular risk assessment for educational and decision-support purposes. "
                "It is not a definitive medical diagnosis and does not replace evaluation by a qualified healthcare professional. "
                "Counterfactual scenarios represent hypothetical model simulations only. "
                "If you experience severe warning symptoms such as chest pain or breathing difficulty, seek emergency medical care immediately.",
                disclaimer_style
            )
        ]]
        disclaimer_table = Table(disclaimer_box_data, colWidths=[520])
        disclaimer_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFFBEB')),
            ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#FCD34D')),
            ('PADDING', (0,0), (-1,-1), 10),
        ]))
        story.append(KeepTogether([disclaimer_table]))

        doc.build(story, canvasmaker=NumberedCanvas)
        return report_id_str, file_path
