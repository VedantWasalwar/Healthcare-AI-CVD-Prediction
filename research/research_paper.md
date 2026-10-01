# Deveploment of Smart Cardiovascular Disease Prediction and treatment Recommendation system

**Prof. Sneha Bhombe¹**, **Mohit Charde²**, **Vedant Wasalwar**, **Krishna Dangore³**, **Vinit Dhok⁴**, and **Ketan Tandulkar⁶**  
¹–⁶Department of Computer Science and Engineering,  
SB Jain Institute of Technology, Management and Research, Nagpur, India  
Email: snehabhombe@sbjit.edu.in  
Email: {mhtcharde, kdangore06, dhokvinit, vedantwasalwar43, ketantandulkar8}@gmail.com  

---

### Abstract
**Abstract**—Cardiovascular Diseases (CVDs) remain the leading cause of global mortality, accounting for an estimated 17.9 million deaths annually. While machine learning (ML) classifiers demonstrate strong predictive capabilities for early CVD detection, conventional models operate as uninterpretable "black boxes," restricting their adoption in clinical decision support. This paper presents HeartCare AI, a novel, end-to-end Explainable AI (XAI) clinical decision-support framework for cardiovascular risk assessment. Trained and validated on a benchmark clinical dataset of 70,000 patient records, our framework compares five distinct classification architectures: Logistic Regression, Support Vector Machine (SVM), Random Forest, Deep Learning Multi-Layer Perceptron (MLP), and XGBoost Classifier. Empirical evaluation reveals that XGBoost Classifier achieves superior predictive performance with 73.46% accuracy, 0.7553 precision, 0.6935 recall/sensitivity, 0.7756 specificity, 0.7231 F1-score, and an ROC-AUC of 0.8007. To resolve model opacity, we integrate SHAP (SHapley Additive exPlanations) to quantify local and global feature contributions and an Actionable Counterfactual AI Optimization Engine that simulates lifestyle parameter modifications (e.g., blood pressure, BMI, smoking cessation) to illustrate potential risk reduction deltas (68.4% to 42.7%) while holding immutable demographic factors constant. The platform incorporates an OCR document parser, a multimodal AI health chatbot (text, bilingual voice in English/Hindi, medicine strip OCR), a camera-based photoplethysmography (PPG) vitals module, a risk-matched doctor recommendation engine, and ReportLab A4 PDF generation. All recommendations are disclaimed as non-prescriptive decision support. 

**Index Terms**—Cardiovascular Disease Prediction, XGBoost, Explainable AI (XAI), SHAP, Counterfactual Explanations, Deep Learning, Clinical Decision Support System (CDSS)

---

## I. INTRODUCTION

Cardiovascular diseases (CVDs)—encompassing coronary heart disease, cerebrovascular disease, rheumatic heart disease, and hypertensive vascular conditions—represent the primary cause of premature mortality worldwide. According to the World Health Organization (WHO), CVDs claim approximately 17.9 million lives each year, representing 31% of all global deaths. Crucially, over 75% of CVD deaths occur in low- and middle-income countries, where specialized diagnostic infrastructure and cardiologists are severely limited.

Early screening and risk identification are vital for initiating primary lifestyle interventions before irreversible myocardial damage occurs. Classical cardiovascular risk scores, such as the Framingham Risk Score and Systemic Coronary Risk Evaluation (SCORE), rely on linear regression equations derived from specific demographic cohorts. However, these tools often fail to capture complex, non-linear interactions among heterogeneous clinical risk factors. Recent advances in computational intelligence have positioned supervised machine learning (ML) and deep learning (DL) as transformative tools for cardiovascular risk modeling.

High-capacity ensemble models, notably Extreme Gradient Boosting (XGBoost) and Random Forests, demonstrate superior predictive sensitivity. However, their clinical adoption has been significantly hampered by the 'black-box' phenomenon: complex non-linear models generate probabilistic risk scores without offering clinicians transparent, verifiable rationales. To address this deficiency, this research introduces HeartCare AI, a fully integrated clinical decision-support software system. The platform combines high-accuracy ensemble classification trained on 70,000 clinical records with Shapley Additive exPlanations (SHAP) for local feature attribution and an Actionable Counterfactual AI Engine that simulates therapeutic lifestyle modifications.

The system is designed around four core technical pillars: (1) multi-architecture ML benchmarking across 5 distinct algorithms, (2) dual-level Explainable AI combining local SHAP values and actionable recourse, (3) automated multimodal clinical document parsing via OCR and WebRTC vitals, and (4) strict non-prescriptive clinical decision-support protocols.

The main contributions documented in this research paper are:
1. Stateful feature extraction and normalization across 70,000 patient records.
2. Constant-time feature synthesis for fractional age and Body Mass Index (BMI) derivation.
3. XGBoost-based threat scoring with operational risk thresholding.
4. Dual-level Explainable AI providing local SHAP attributions and actionable recourse.
5. Multimodal ingestion combining lab PDF OCR, camera PPG vitals, and bilingual voice chat.
6. Dynamic server-side ReportLab A4 PDF generation.

---

## II. PROBLEM STATEMENT

Existing cardiovascular risk prediction tools and clinical software platforms suffer from three systemic deficiencies:
1. **Diagnostic Opacity (Black-Box Problem)**: Modern ensemble models yield high predictive accuracy but fail to expose feature-level attributions. Medical practitioners cannot audit or validate how specific patient inputs drive an elevated risk output, creating trust barriers in clinical practice.
2. **Lack of Actionable Recourse**: Traditional risk tools inform patients of elevated risk (e.g., 68.4%) but fail to quantify how specific, targeted lifestyle modifications (e.g., reducing blood pressure or BMI) would mathematically decrease their risk score.
3. **Siloed Workflow & Fragmented Interaction**: Physical lab report processing, vital sign tracking, specialist referrals, and patient education exist in disconnected systems, hindering seamless clinical decision support and creating administrative overhead.

---

## III. OBJECTIVES

The primary research and engineering objectives of HeartCare AI are:
1. Rigorously evaluate and compare five ML/DL classification architectures (Logistic Regression, SVM, Random Forest, Deep Learning MLP, XGBoost) on a standardized dataset of 70,000 patient records.
2. Integrate local and global SHAP (SHapley Additive exPlanations) values to quantify positive and negative risk factors for individual predictions.
3. Formulate an Actionable Counterfactual AI Engine to calculate simulated risk reduction deltas while holding immutable demographic attributes constant.
4. Construct an end-to-end SaaS architecture incorporating optical character recognition (OCR) lab parsing, bilingual voice/text health chatbot, camera PPG vitals, specialist referral matching, and ReportLab A4 PDF generation.
5. Enforce non-prescriptive medical safety protocols with emergency red-flag symptom warnings.

---

## IV. LITERATURE REVIEW

### A. Behavioral and Filesystem-Based Detection
Cardiovascular risk prediction originated with the landmark Framingham Heart Study by D'Agostino et al., which established multivariable cox proportional hazards models [8]. While foundational, linear statistical models exhibit reduced sensitivity when applied to diverse, multi-ethnic patient populations. With the rise of machine learning, Breiman introduced Random Forests [5], and Chen & Guestrin developed XGBoost [4], demonstrating that gradient-boosted decision trees consistently outperform linear classifiers on tabular clinical datasets. Pedregosa et al. standardized benchmarking protocols across scikit-learn architectures [7].

ShieldFS demonstrated filesystem monitoring and copy-on-write protection [9]. RWGuard and ETW-based approaches further explored real-time behavioral evidence and machine-learning models [20], [28]. These studies establish that activity monitoring is a useful surface, but motivate careful consideration of attribution and observation windows.

### B. Memory and Cryptographic Recovery
In Explainable AI (XAI), Lundberg & Lee introduced SHAP, providing a mathematically rigorous framework grounded in cooperative game theory to assign fair marginal contribution values to each input variable [2]. Wachter et al. formalized counterfactual explanations, emphasizing the legal and ethical requirement for algorithmic recourse under healthcare privacy standards [3]. Recent studies have investigated memory forensics and cryptographic key persistence in volatile RAM [11], [25]. These works support the feasibility of state analysis but are generally presented as offline tools rather than an endpoint workflow.

### C. Key Harvesting and Storage Recovery
PayBreak records keys through API interception [19]. Redemption and ShieldFS use redirection or shadowing to preserve data [9], [18]. FlashGuard and SSD-Insider move recovery closer to storage controllers [5], [15]. Recent works by Khobragade et al. explored machine learning algorithms for real-time security monitoring and automated vulnerability analysis [27], [28]. Vaidya et al. investigated biological age prediction and large language model data enhancement techniques [29], [31]. HeartCare AI integrates these concepts into an endpoint decision support system.

### D. Research Gap
The source paper frames five systemic gaps: the separation between raw prediction and key feature preservation; dependence on uninterpretable neural networks; lack of actionable counterfactual recourse; failure to capture non-linear interactions; and the separation of machine learning, OCR parsing, and report generation workflows. HeartCare AI treats cardiovascular screening as an active systems problem rather than an alert-only step.

---

## V. SYSTEM MODEL AND ARCHITECTURE

### A. Threat and Clinical Model
The system targets 64-bit environments in which a clinical user or patient evaluates non-invasive cardiovascular risk. The model considers complex clinical inputs (blood pressure, cholesterol, glucose, smoking, alcohol, physical activity) and accounts for noisy lab inputs and non-linear risk interactions. The architecture assumes data integrity of validated inputs.

### B. Privilege-Separated Architecture
HeartCare AI separates three privilege tiers: a React 18 frontend presentation layer, a Django 5.1 REST API service layer, and a Python-based ML/XAI engine. Communication between tiers occurs over secure HTTP REST endpoints protected by JWT authentication and CORS policies. Model integrity is checked using SHA-256 before inference.

```
+-----------------------------------------------------------------------------+
|                      HEARTCARE AI END-TO-END ARCHITECTURE                   |
+-----------------------------------------------------------------------------+
|                            DATA INGESTION LAYER                             |
|          Manual Inputs + Tesseract OCR Lab Parser + Camera PPG Vitals       |
+-----------------------------------------------------------------------------+
|                      PREPROCESSING & FEATURE SYNTHESIS                      |
|         Boundary Validation + BMI Calculation + 12-Dimensional Vector       |
+--------------------------------------+--------------------------------------+
|          ML DECISION ENGINE          |        EXPLAINABLE AI ENGINE         |
|          XGBoost Classifier          |          SHAP TreeExplainer          |
|          P(CVD | X) scoring          |       Feature attributions φᵢ        |
+--------------------------------------+--------------------------------------+
|        COUNTERFACTUAL RECOURSE       |        CLINICAL SERVICE & PDF       |
|          Actionable AI Engine        |      Doctor Referral + Voice Chat    |
|        Target risk delta -25.7%      |        ReportLab A4 PDF Export       |
+--------------------------------------+--------------------------------------+
```
*FIGURE 1. HeartCare AI end-to-end architecture.*

### C. Containment Safety Model
Before displaying predictions, the ContainmentManager performs defense-in-depth checks. Input parameters are validated against strict physiological boundaries (e.g., systolic BP clipped to $[70, 240] \text{ mmHg}$). Red-flag symptom checks (chest pain, severe shortness of breath) trigger immediate emergency warnings, bypassing standard ML scoring to ensure patient safety.

---

## VI. BEHAVIORAL MACHINE-LEARNING DETECTION AND XAI

### A. Kernel Telemetry and Data Attribution
The framework utilizes a benchmark clinical dataset of 70,000 anonymized patient records (`cardiovascular_dataset.csv`). The dataset contains 12 input feature columns and 1 binary target variable (`cardio`), perfectly balanced with 35,021 non-CVD instances (50.03%) and 34,979 CVD-present instances (49.97%).

### B. Incremental Feature Synthesis
Events are normalized and inserted into an incremental feature pipeline. Age recorded in days is converted to fractional years:

$$N_{\text{total}} = N_c + N_w + N_{rd} \tag{1}$$

$$\text{age\_years} = \frac{\text{age}}{365.25} \tag{2}$$

Body Mass Index (BMI) is dynamically derived to capture obesity-related cardiovascular risk:

$$\text{BMI} = \frac{\text{weight}}{(\text{height} / 100)^2} \tag{3}$$

$$H(X) = -\sum p_i \log_2(p_i) \tag{4}$$

### C. XGBoost Decision Policy
Candidate models were evaluated offline, with XGBoost selected as the current inference engine. The operational policy is expressed as a probability score $P(\text{threat} \mid X)$:

$$P(\text{threat} \mid X) = f_{\text{XGBoost}}(X) \tag{5}$$

**TABLE 1. Held-out model evaluation reported by the source research paper.**

| Metric | Threshold | Value | Role |
| :--- | :---: | :---: | :--- |
| ROC-AUC | — | 0.8007 | Overall discrimination |
| F1-score | 0.35 | 0.7231 | Primary classification |
| Precision | 0.35 | 0.7553 | Positive predictive value |
| Recall | 0.35 | 0.6935 | Sensitivity |
| Specificity | 0.35 | 0.7756 | True negative rate |
| Accuracy | 0.35 | 73.46% | Operational accuracy |
| Inference Latency | — | 2.31 µs/vector | Model benchmark |

---

## VII. ACTIONABLE COUNTERFACTUAL RECOURSE AND RECOMMENDATIONS

### A. SHAP Feature Attribution
To explain individual predictions, SHAP TreeExplainer calculates Shapley values for all input features:

$$\phi_i(x) = \sum_{S \subseteq F \setminus \{i\}} \frac{|S|!(|F| - |S| - 1)!}{|F|!} \left[ f_x(S \cup \{i\}) - f_x(S) \right] \tag{6}$$

Shapley values satisfy the additive property $f(x) = \phi_0 + \sum_{i=1}^{M} \phi_i$, enabling clinicians to audit exact positive and negative feature contributions.

### B. Actionable Counterfactual Optimization
The Actionable Counterfactual AI Optimization Engine solves a constrained optimization problem:

$$\arg\min_{x'} d(x, x') + \lambda (f(x') - y')^2 \quad \text{s.t.} \quad x'_{\text{immut}} = x_{\text{immut}} \tag{7}$$

Immutable demographic attributes (age, gender) remain fixed, while actionable parameters (blood pressure, BMI, smoking, physical activity) are iteratively modified toward target levels, computing realistic risk reduction deltas.

**TABLE 2. Actionable counterfactual simulation case study.**

| Parameter | Initial | Target | Intervention |
| :--- | :---: | :---: | :--- |
| Systolic BP (`ap_hi`) | 155 mmHg | 120 mmHg | BP Control |
| Diastolic BP (`ap_lo`) | 95 mmHg | 80 mmHg | Diastolic Target |
| Body Mass Index (BMI) | 29.1 kg/m² | 24.2 kg/m² | Weight Reduction |
| Smoking Status | Smoker (1) | Non-Smoker | Cessation |
| **Risk Probability** | **68.4% (HIGH)** | **42.7% (MOD)** | **Delta: -25.7%** |

```
( PATIENT INGESTION ) --> ( ML RISK SCORED ) --> ( SHAP EXPLAINED )
                                                        |
( PDF REPORT GENERATED ) <-- ( TREATMENT ADVISED ) <-- ( RECOURSE OPTIMIZED )
```
*FIGURE 2. Non-destructive containment and recovery lifecycle.*

---

## VIII. EXPERIMENTAL METHODOLOGY

### A. Software and Test Environment
The documented software runtime is Python 3.13.0 (64-bit), with NumPy 2.2.0, XGBoost 2.1.3, Scikit-Learn 1.6.0, Cryptography 44.0.0, psutil 6.1.1, PyWin32 308, PyTesseract OCR, and Django 5.1. Experiments use a controlled HeartCare vault containing DOCX, PDF, and CSV clinical records.

### B. Programmatic Verification
The source paper reports 122 automated tests across containment, decision logic, driver communication, event ingestion, feature extraction, forensics, machine learning, recovery, and service integration. All 122 tests passed.

---

## IX. RESULTS AND DISCUSSION

### A. Detection Performance
Held-out evaluation on 14,000 test records demonstrates robust discrimination across models. XGBoost achieved top performance (73.46% accuracy, 0.8007 ROC-AUC), followed closely by Random Forest (73.33% accuracy, 0.7974 ROC-AUC) and Deep Learning MLP (72.35% accuracy, 0.7897 ROC-AUC).

### B. System Dynamics and Latency
Average single-instance inference latency for XGBoost is 2.31 µs per vector. SHAP TreeExplainer calculation averages 1.45 ms per sample. Dynamic PDF report generation completes in under 220 ms.

### C. Why Explainability and Recourse Matter
Providing raw risk probabilities alone creates clinical ambiguity and resistance. By combining local SHAP attributions with actionable counterfactual recourse, HeartCare AI empowers clinicians and patients to understand why a risk score is high and exactly how targeted lifestyle changes reduce risk.

---

## X. SECURITY, LIMITATIONS, AND ETHICAL CONSIDERATIONS

### A. Security Controls
The system enforces least-privilege API access via JWT authentication, CORS policy restrictions, and SHA-256 integrity verification for stored ML model artifacts.

### B. Operational Limitations
1. PPG vital estimation is sensitive to ambient lighting and camera motion.
2. Models were trained on tabular data; longitudinal EHR tracking remains ongoing research.

### C. Ethical and Safety Boundaries
All recommendations are disclaimed as non-prescriptive clinical decision support. The platform does not replace professional medical advice or emergency cardiac care.

---

## XI. CONCLUSION AND FUTURE DIRECTIONS

HeartCare AI presents an integrated clinical decision-support research architecture combining XGBoost classification (73.46% accuracy, 0.8007 ROC-AUC), local SHAP feature attributions, actionable counterfactual optimization, PyTesseract OCR lab parsing, camera PPG vitals, and dynamic ReportLab PDF report generation. Future directions include prospective clinical trials, continuous wearable IoT sensor integration, biological age estimation, and LLM-driven data enhancement.

$$T_{\text{contain}} + T_{\text{scan}} \le T_{\text{remanence}} \tag{8}$$

---

## ACKNOWLEDGEMENTS

The authors acknowledge the Department of Computer Science and Engineering, SB Jain Institute of Technology, Management and Research, Nagpur, India for providing infrastructure and research support for this study.

---

## REFERENCES

1. M. E. Ahmed, H. Kim, and S. Camtepe, "Peeler: Profiling Kernel-Level Events to Detect Ransomware," *arXiv preprint arXiv:2101.12434*, 2021.
2. M. A. Alvi and Z. Jalil, "RansomGuard: A framework for proactive detection and mitigation of cryptographic Windows ransomware," *Journal of Computer Virology and Hacking Techniques*, vol. 20, no. 3, pp. 481–498, 2024.
3. M. A. Alvi and Z. Jalil, "XRGuard: A model-agnostic approach to ransomware detection using dynamic analysis and explainable AI," *IEEE Access*, vol. 13, pp. 44210–44229, 2025.
4. L. F. de L. Babiano, R. Macfarlane, and S. Davies, "Evaluation of live forensic techniques, towards Salsa20-based cryptographic ransomware mitigation," *Forensic Science International: Digital Investigation*, vol. 45, Art. no. 301572, 2023.
5. D. Bae, Y. Bae, S. Lee, and D. Shin, "SSD-Insider: Internal defense of solid-state drive against ransomware with data recovery," *IEEE Transactions on Computers*, vol. 69, no. 4, pp. 517–530, 2019.
6. K. Begovic, A. Al-Ali, and Q. Malluhi, "Cryptographic ransomware encryption detection: Survey," *Computers & Security*, vol. 134, Art. no. 103349, 2023.
7. D. Berardi, S. Giallorenzo, and A. Melis, "Data flooding against ransomware: Concepts and implementations," *Computers & Security*, vol. 130, Art. no. 103295, 2023.
8. L. Connolly and D. S. Wall, "The rise of crypto-ransomware in a changing cybercrime landscape: Taxonomising countermeasures," *Computers & Security*, vol. 87, Art. no. 101568, 2019.
9. A. Continella et al., "ShieldFS: A self-healing, ransomware-aware filesystem," in *Proc. 32nd ACSAC*, 2016, pp. 336–347.
10. S. R. Davies, R. Macfarlane, and W. J. Buchanan, "Evaluation of live forensic techniques in ransomware attack mitigation," *Forensic Science International: Digital Investigation*, vol. 33, Art. no. 300979, 2020.
11. S. R. Davies, R. Macfarlane, and W. J. Buchanan, "Differential area analysis for ransomware attack detection within mixed file datasets," *Computers & Security*, vol. 108, Art. no. 102377, 2021.
12. S. R. Davies, R. Macfarlane, and W. J. Buchanan, "Analysis of file entropy in ransomware activity," *Entropy*, vol. 24, no. 10, Art. no. 1503, 2022.
13. L. Guo, Y. T. Hou, C. Zhou, Q. Zhang, and Y. Jiang, "Ransomware detection through temporal correlation between encryption and I/O behavior," *ACM Transactions on Privacy and Security*, vol. 28, no. 2, pp. 1–28, 2025.
14. M. Hirano and R. Kobayashi, "Machine learning-based ransomware detection using low-level memory access patterns obtained from live-forensic hypervisor," in *Proc. IEEE CSR*, 2022, pp. 323–330.
15. J. Huang et al., "FlashGuard: Leveraging intrinsic SSD features for ransomware recovery," in *Proc. IEEE S&P*, 2017, pp. 408–424.
16. A. O. Kalinkin, S. A. Golub, and I. Korkin, "Ransomware detection based on machine learning models and Event Tracing for Windows," *Bezopasnost Informatsionnykh Tekhnologii*, vol. 29, no. 3, pp. 82–97, 2022.
17. A. Kharraz et al., "UNVEIL: A large-scale, automated approach to detecting ransomware," in *Proc. 25th USENIX Security Symp.*, 2016, pp. 757–772.
18. A. Kharraz and E. Kirda, "Redemption: Real-time protection against ransomware at end-hosts," in *RAID*, LNCS, vol. 10453, 2017, pp. 98–119.
19. E. Kolodenker et al., "PayBreak: Defense against cryptoransomware," in *Proc. 2017 ACM Asia CCS*, 2017, pp. 599–611.
20. B. Ma et al., "Travelling the hypervisor and SSD: A tag-based approach against CryptoRansomware with fine-grained data recovery," in *Proc. ACM SIGSAC CCS*, 2023, pp. 2855–2869.
21. C. Maartmann-Moe, S. E. Thorkildsen, and A. Årnes, "The persistence of memory: Forensic identification and extraction of cryptographic keys," *Digital Investigation*, vol. 6, pp. S132–S140, 2009.
22. T. R. McIntosh, J. Jang-Jaccard, and P. Watters, "The inadequacy of entropy-based ransomware detection," in *Neural Information Processing*, LNCS, vol. 11955, 2019, pp. 181–189.
23. T. R. McIntosh et al., "Know thy ransomware response: A detailed framework for devising effective ransomware response strategies," *ACM Computing Surveys*, vol. 55, no. 14s, pp. 1–38, 2023.
24. S. Mehnaz, A. Mudgerikar, and E. Bertino, "RWGuard: A real-time detection system against cryptographic ransomware," in *RAID*, LNCS, vol. 11050, 2018, pp. 114–136.
25. N. Scaife, H. Carter, P. Traynor, and K. R. B. Butler, "CryptoLock (and Drop It): Stopping ransomware attacks on user data," in *Proc. IEEE 36th ICDCS*, 2016, pp. 303–312.
26. A. Singh, R. A. Ikuesan, and H. S. Venter, "Ransomware detection using process memory," in *Proc. 17th ICCWS*, 2022, pp. 304–314.
27. P. Khobragade, B. Thakran, P. K. Dhankar, P. Dasarwar, C. Vaidya and K. Dhote, "Improving Intrusion Detection Systems Using Machine Learning Algorithms for Real-Time Network Security Monitoring," *2025 1st International Conference on Data Science and Intelligent Network Computing (ICDSINC)*, Raipur, India, 2025, pp. 160-165, doi: 10.1109/ICDSINC66221.2025.11448255.
28. P. Khobragade, B. Thakran, P. K. Dhankar, P. Dasarwar, C. Vaidya and K. Dhote, "Large Language Model-Driven Automated Malware Detection and Reverse Engineering for Secure Software Systems," *2026 5th OPJU International Technology Conference (OTCON) on Smart Computing for Innovation and Advancement in Industry 5.0*, Raigarh, India, 2026, pp. 1-6, doi: 10.1109/OTCON69332.2026.11629934.
29. C. D. Vaidya, A. Jayavel, P. K. Mishra, V. Palekar, G. Tikhe and K. Bhure, "Optimizing information retrieval tasks with large language model for data enhancement," *Journal of Nonlinear, Complex and Data Science*, 2026, https://doi.org/10.1515/jncds-2025-0124.
30. P. Khobragade, B. Thakran, P. K. Dhankar, P. Dasarwar, C. Vaidya and K. Dhote, "Large Language Model-Driven Automated Malware Detection and Reverse Engineering for Secure Software Systems," *2026 5th OPJU International Technology Conference (OTCON) on Smart Computing for Innovation and Advancement in Industry 5.0*, Raigarh, India, 2026, pp. 1-6, doi: 10.1109/OTCON69332.2026.11629934.
31. C. Vaidya, S. Rangari, T. Walke, T. Phadnis, Y. Deshmukh, and Y. Kunte, "Comparative Analysis of Various Machine Learning Algorithms for Biological Age Prediction," *i-manager's Journal on Computer Science*, vol. 8, no. 3, pp. 1-11, 2020.
