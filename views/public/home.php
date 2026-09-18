<?php
$heroSlides = $heroSlides ?? [];
$depositRates = $depositRates ?? [];
$loanRates = $loanRates ?? [];
$latestNews = $latestNews ?? [];
$featuredDeposits = $featuredDeposits ?? [];
$featuredLoans = $featuredLoans ?? [];
$calcLoanProducts = $calcLoanProducts ?? [];
$latestStats = $latestStats ?? null;
$eservices = $eservices ?? [];
$importantAnnouncements = $importantAnnouncements ?? [];
$upcomingEvents = $upcomingEvents ?? [];
?>

<!-- 1. Hero Slideshow Section (Swiper) -->
<section class="hero-section position-relative">
    <div class="swiper hero-swiper">
        <div class="swiper-wrapper">
            <?php if (!empty($heroSlides)): ?>
                <?php foreach ($heroSlides as $slide): ?>
                    <?php
                    $slideImg = !empty($slide['desktop_image']) ? $slide['desktop_image'] : 'hero_bg_default.jpg';
                    if (str_starts_with($slideImg, 'http://') || str_starts_with($slideImg, 'https://')) {
                        $bgUrl = $slideImg;
                    } elseif (str_starts_with($slideImg, 'storage/') || str_starts_with($slideImg, '/storage/')) {
                        $bgUrl = url(ltrim($slideImg, '/'));
                    } else {
                        $bgUrl = asset('img/' . $slideImg);
                    }
                    ?>
                    <div class="swiper-slide hero-slide" style="background-image: url('<?= $bgUrl ?>');">
                        <div class="hero-overlay" style="opacity: <?= e($slide['overlay_opacity'] ?? '0.80') ?>;"></div>
                        <div class="container-xl position-relative z-2">
                            <div class="row align-items-center g-4">
                                <div class="col-lg-7 col-md-12 text-<?= e($slide['text_alignment'] ?? 'left') ?>">
                                    <span class="badge bg-gold text-white mb-3 px-3 py-2 rounded-pill fw-semibold shadow-sm">
                                        <i class="bi bi-shield-check me-1"></i> <?= e($slide['subtitle'] ?? 'สอ.สธ.ระยอง') ?>
                                    </span>
                                    <h1 class="hero-title"><?= e($slide['title']) ?></h1>
                                    <p class="hero-subtitle"><?= e($slide['description'] ?? '') ?></p>
                                    <div class="d-flex flex-wrap gap-3 <?= ($slide['text_alignment'] ?? 'left') === 'center' ? 'justify-content-center' : '' ?>">
                                        <?php if (!empty($slide['button_text']) && !empty($slide['button_url'])): ?>
                                            <a href="<?= url($slide['button_url']) ?>" target="<?= e($slide['button_target'] ?? '_self') ?>" class="btn btn-primary btn-lg px-4 py-2 rounded-3 shadow">
                                                <?= e($slide['button_text']) ?> <i class="bi bi-arrow-right ms-2"></i>
                                            </a>
                                        <?php endif; ?>
                                        <a href="<?= url('calculator') ?>" class="btn btn-outline-light btn-lg px-4 py-2 rounded-3">
                                            <i class="bi bi-calculator me-1"></i> คำนวณเงินกู้
                                        </a>
                                    </div>
                                </div>
                                <div class="col-lg-5 d-none d-lg-block">
                                    <div class="hero-highlight-glass p-4 rounded-4 shadow-lg text-white">
                                        <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-white-20">
                                            <div class="fw-bold fs-6"><i class="bi bi-stars text-warning me-1"></i> จุดเด่นทางการเงิน</div>
                                            <span class="badge bg-white text-navy px-2 py-1 rounded-pill small fw-bold">อัปเดตล่าสุด</span>
                                        </div>
                                        <div class="row g-3">
                                            <div class="col-6">
                                                <div class="hero-stat-card p-3 rounded-3 text-center">
                                                    <div class="small text-white-80">เงินฝากออมทรัพย์พิเศษ</div>
                                                    <div class="fs-2 fw-bold text-gold my-1">3.10%</div>
                                                    <div class="small text-white-70">ต่อปี ปลอดภาษี</div>
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <div class="hero-stat-card p-3 rounded-3 text-center">
                                                    <div class="small text-white-80">สินเชื่อสามัญ</div>
                                                    <div class="fs-2 fw-bold text-white my-1">4.50%</div>
                                                    <div class="small text-white-70">ต่อปี ลดต้นลดดอก</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mt-3 pt-3 border-top border-white-20 d-flex justify-content-between align-items-center">
                                            <small class="text-white-90"><i class="bi bi-shield-check text-warning me-1"></i> มั่นคง โปร่งใส เพื่อสมาชิก</small>
                                            <a href="<?= url('eservice') ?>" class="btn btn-sm btn-gold text-navy fw-bold px-3 shadow-sm">
                                                เข้าสู่ระบบ E-Service <i class="bi bi-chevron-right ms-1"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="swiper-slide hero-slide">
                    <div class="hero-overlay"></div>
                    <div class="container-xl position-relative z-2 text-white">
                        <h1 class="hero-title">มั่นคง โปร่งใส ทันสมัย เพื่อคุณภาพชีวิตที่ดีของสมาชิก</h1>
                        <p class="hero-subtitle">สหกรณ์ออมทรัพย์สาธารณสุขระยอง จำกัด</p>
                    </div>
                </div>
            <?php endif; ?>
        </div>
        <div class="swiper-pagination"></div>
        <div class="swiper-button-next d-none d-md-flex"></div>
        <div class="swiper-button-prev d-none d-md-flex"></div>
    </div>
</section>

<!-- 2. Quick Services Bar (1-2 Clicks Access) -->
<section class="container-xl">
    <div class="quick-services-card">
        <div class="row row-cols-2 row-cols-sm-3 row-cols-md-6 g-3 justify-content-center">
            <div class="col">
                <a href="<?= url('deposits') ?>" class="quick-service-item">
                    <div class="quick-service-icon"><i class="bi bi-piggy-bank"></i></div>
                    <span class="quick-service-label">เงินฝาก</span>
                </a>
            </div>
            <div class="col">
                <a href="<?= url('loans') ?>" class="quick-service-item">
                    <div class="quick-service-icon"><i class="bi bi-cash-stack"></i></div>
                    <span class="quick-service-label">เงินกู้</span>
                </a>
            </div>
            <div class="col">
                <a href="<?= url('calculator') ?>" class="quick-service-item">
                    <div class="quick-service-icon"><i class="bi bi-calculator"></i></div>
                    <span class="quick-service-label">คำนวณเงินกู้</span>
                </a>
            </div>
            <div class="col">
                <a href="<?= url('rates') ?>" class="quick-service-item">
                    <div class="quick-service-icon"><i class="bi bi-percent"></i></div>
                    <span class="quick-service-label">อัตราดอกเบี้ย</span>
                </a>
            </div>
            <div class="col">
                <a href="<?= url('welfare') ?>" class="quick-service-item">
                    <div class="quick-service-icon"><i class="bi bi-heart-pulse"></i></div>
                    <span class="quick-service-label">สวัสดิการ</span>
                </a>
            </div>
            <div class="col">
                <a href="<?= url('eservice') ?>" class="quick-service-item">
                    <div class="quick-service-icon" style="background: linear-gradient(135deg, #073B74 0%, #0B5ED7 100%); color: #fff;">
                        <i class="bi bi-person-circle"></i>
                    </div>
                    <span class="quick-service-label text-navy fw-bold">E-Service</span>
                </a>
            </div>
        </div>
    </div>
</section>

<!-- 2.1 Important Announcements Ribbon / Card Section -->
<?php if (!empty($importantAnnouncements)): ?>
    <section class="container-xl mt-4">
        <div class="card border-0 rounded-4 shadow-sm overflow-hidden" style="background: linear-gradient(135deg, #FEF2F2 0%, #FFF1F2 100%); border-left: 5px solid #EF4444 !important;">
            <div class="card-body p-3 p-md-4">
                <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0" style="width: 44px; height: 44px; background-color: #EF4444;">
                            <i class="bi bi-pin-angle-fill fs-5"></i>
                        </div>
                        <div>
                            <div class="d-flex align-items-center gap-2 flex-wrap mb-1">
                                <span class="badge bg-danger">ประกาศสำคัญ</span>
                                <span class="small text-muted"><?= date('d/m/Y', strtotime($importantAnnouncements[0]['publication_date'] ?? 'now')) ?></span>
                            </div>
                            <a href="<?= url('announcements/' . $importantAnnouncements[0]['slug']) ?>" class="fw-bold text-dark text-decoration-none hover-primary mb-0" style="font-size: 1.05rem;">
                                <?= e($importantAnnouncements[0]['title']) ?>
                            </a>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-2 flex-shrink-0 ms-auto">
                        <a href="<?= url('announcements/' . $importantAnnouncements[0]['slug']) ?>" class="btn btn-sm btn-danger rounded-pill px-3">
                            อ่านประกาศ <i class="bi bi-arrow-right ms-1"></i>
                        </a>
                        <a href="<?= url('announcements') ?>" class="btn btn-sm btn-outline-secondary rounded-pill px-3">
                            ดูทั้งหมด (<?= count($importantAnnouncements) ?>)
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
<?php endif; ?>

<!-- 3. Financial Rates Dashboard Section -->
<section class="py-5">
    <div class="container-xl">
        <div class="row align-items-center mb-4">
            <div class="col-md-8">
                <span class="text-gold fw-bold text-uppercase small"><i class="bi bi-graph-up me-1"></i> อัตราดอกเบี้ยปัจจุบัน</span>
                <h2 class="fw-bold text-navy mb-1">อัตราดอกเบี้ยเงินฝากและเงินกู้</h2>
                <p class="text-muted small mb-0">ข้อมูลอัตราดอกเบี้ยล่าสุดจากระบบฐานข้อมูลสหกรณ์ออมทรัพย์สาธารณสุขระยอง จำกัด</p>
            </div>
            <div class="col-md-4 text-md-end mt-3 mt-md-0">
                <a href="<?= url('rates') ?>" class="btn btn-outline-primary btn-sm">
                    ดูประวัติการเปลี่ยนแปลงทั้งหมด <i class="bi bi-arrow-right ms-1"></i>
                </a>
            </div>
        </div>

        <div class="row g-4">
            <!-- Deposit Rates Card -->
            <div class="col-lg-6">
                <div class="coop-card p-4 h-100">
                    <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                        <div class="d-flex align-items-center">
                            <div class="bg-light-blue text-primary rounded-circle p-2 me-2">
                                <i class="bi bi-piggy-bank-fill fs-4"></i>
                            </div>
                            <div>
                                <h5 class="fw-bold text-navy mb-0">อัตราดอกเบี้ยเงินฝาก</h5>
                                <small class="text-muted">ผลตอบแทนสูง ปลอดภาษี</small>
                            </div>
                        </div>
                        <span class="badge bg-success">อัปเดตล่าสุด</span>
                    </div>

                    <div class="table-responsive">
                        <table class="table rate-table mb-0">
                            <thead>
                                <tr>
                                    <th>ประเภทเงินฝาก</th>
                                    <th class="text-end">อัตราดอกเบี้ยต่อปี</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($depositRates as $dr): ?>
                                    <tr>
                                        <td>
                                            <div class="fw-bold text-navy"><?= e($dr['product_name']) ?></div>
                                            <small class="text-muted">มีผล <?= thai_date($dr['effective_date']) ?></small>
                                        </td>
                                        <td class="text-end">
                                            <span class="rate-badge rate-badge-gold">
                                                <?= number_format((float)$dr['rate'], 2) ?>%
                                            </span>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Loan Rates Card -->
            <div class="col-lg-6">
                <div class="coop-card p-4 h-100">
                    <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                        <div class="d-flex align-items-center">
                            <div class="bg-light-blue text-primary rounded-circle p-2 me-2">
                                <i class="bi bi-cash-coin fs-4"></i>
                            </div>
                            <div>
                                <h5 class="fw-bold text-navy mb-0">อัตราดอกเบี้ยเงินกู้</h5>
                                <small class="text-muted">ดอกเบี้ยต่ำ แบบลดต้นลดดอก</small>
                            </div>
                        </div>
                        <a href="<?= url('calculator') ?>" class="btn btn-sm btn-outline-primary">
                            <i class="bi bi-calculator"></i> ลองคำนวณ
                        </a>
                    </div>

                    <div class="table-responsive">
                        <table class="table rate-table mb-0">
                            <thead>
                                <tr>
                                    <th>ประเภทเงินกู้</th>
                                    <th class="text-end">อัตราดอกเบี้ยต่อปี</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($loanRates as $lr): ?>
                                    <tr>
                                        <td>
                                            <div class="fw-bold text-navy"><?= e($lr['product_name']) ?></div>
                                            <small class="text-muted">มีผล <?= thai_date($lr['effective_date']) ?></small>
                                        </td>
                                        <td class="text-end">
                                            <span class="rate-badge">
                                                <?= number_format((float)$lr['rate'], 2) ?>%
                                            </span>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- 4. Interactive Loan Calculator Preview Widget -->
<section class="py-5 bg-light">
    <div class="container-xl">
        <div class="calc-card p-4 p-md-5">
            <div class="row g-4 align-items-center">
                <div class="col-lg-6">
                    <span class="text-gold fw-bold small text-uppercase"><i class="bi bi-calculator me-1"></i> วางแผนทางการเงิน</span>
                    <h2 class="fw-bold text-navy mb-3">โปรแกรมคำนวณเงินกู้ออนไลน์</h2>
                    <p class="text-muted mb-4">
                        ช่วยคุณประเมินภาระการผ่อนชำระค่างวดรายเดือนและดอกเบี้ยรวมได้อย่างแม่นยำ ด้วยระบบคำนวณแบบลดต้นลดดอกมาตรฐานสถาบันการเงิน
                    </p>

                    <form id="homeQuickCalcForm" class="row g-3">
                        <div class="col-md-12">
                            <label class="form-label fw-bold small">เลือกประเภทสินเชื่อ</label>
                            <select class="form-select" id="calcProduct">
                                <?php if (!empty($calcLoanProducts)): ?>
                                    <?php foreach ($calcLoanProducts as $lp): ?>
                                        <option value="<?= e($lp['id']) ?>" data-rate="<?= e($lp['interest_rate']) ?>" data-max-term="<?= e($lp['max_term_months']) ?>" data-method="<?= e($lp['calculation_type']) ?>">
                                            <?= e($lp['name']) ?> (อัตราดอกเบี้ย <?= number_format((float)$lp['interest_rate'], 2) ?>% ต่อปี)
                                        </option>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <option value="1" data-rate="6.15" data-max-term="180">เงินกู้สามัญ (อัตราดอกเบี้ย 6.15% ต่อปี)</option>
                                    <option value="2" data-rate="4.75" data-max-term="12">เงินกู้ฉุกเฉิน (อัตราดอกเบี้ย 4.75% ต่อปี)</option>
                                    <option value="3" data-rate="5.25" data-max-term="360">เงินกู้พิเศษ (อัตราดอกเบี้ย 5.25% ต่อปี)</option>
                                    <option value="4" data-rate="5.50" data-max-term="36">เงินกู้ผ่อนชำระสินค้า ฯ (อัตราดอกเบี้ย 5.50% ต่อปี)</option>
                                    <option value="5" data-rate="2.00" data-max-term="60">เงินกู้เพื่อการศึกษา (อัตราดอกเบี้ย 2.00% ต่อปี)</option>
                                    <option value="6" data-rate="5.50" data-max-term="120">เงินกู้เพื่อพัฒนาคุณภาพชีวิต (อัตราดอกเบี้ย 5.50% ต่อปี)</option>
                                    <option value="7" data-rate="4.00" data-max-term="84">เงินกู้เพื่อจัดซื้อรถยนต์ (อัตราดอกเบี้ย 4.00% ต่อปี)</option>
                                    <option value="8" data-rate="5.25" data-max-term="240">เงินกู้พิเศษเพื่อความมั่นคงในชีวิต (อัตราดอกเบี้ย 5.25% ต่อปี)</option>
                                    <option value="9" data-rate="4.75" data-max-term="180">เงินกู้เพื่อปรับปรุงโครงสร้างหนี้ (อัตราดอกเบี้ย 4.75% ต่อปี)</option>
                                    <option value="10" data-rate="2.00" data-max-term="60">เงินกู้รับการค้ำประกัน (อัตราดอกเบี้ย 2.00% ต่อปี)</option>
                                <?php endif; ?>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold small">วงเงินกู้ (บาท)</label>
                            <input type="number" class="form-control" id="calcPrincipal" value="500000" step="10000" min="10000">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold small">ระยะเวลาผ่อน (งวด/เดือน)</label>
                            <input type="number" class="form-control" id="calcTerm" value="60" min="1" max="360">
                        </div>
                        <input type="hidden" id="calcRate" value="6.15">
                        <input type="hidden" id="calcMethod" value="effective">
                    </form>
                </div>

                <div class="col-lg-6">
                    <div class="calc-result-box shadow-sm">
                        <h6 class="text-light-blue fw-semibold mb-1">ประมาณการค่างวดรายเดือน</h6>
                        <div class="calc-result-figure mb-3" id="calcResultMonthly">0.00 บาท</div>

                        <div class="row g-2 border-top border-light border-opacity-25 pt-3">
                            <div class="col-6">
                                <small class="text-light-blue d-block">เงินต้นทั้งหมด</small>
                                <span class="fw-bold fs-6" id="calcResultPrincipal">0.00 บาท</span>
                            </div>
                            <div class="col-6">
                                <small class="text-light-blue d-block">ดอกเบี้ยรวมโดยประมาณ</small>
                                <span class="fw-bold fs-6 text-warning" id="calcResultInterest">0.00 บาท</span>
                            </div>
                        </div>

                        <div class="mt-4 pt-2">
                            <a href="<?= url('calculator') ?>" class="btn btn-gold w-100 py-2">
                                <i class="bi bi-file-earmark-text me-1"></i> ดูตารางผ่อนชำระละเอียด (Amortization Schedule)
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- 4.1 Digital Services & Member Voice Hub -->
<section class="py-4 py-lg-5" style="background: linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%);">
    <div class="container-xl">
        <div class="row g-4">
            <!-- Tool 1: Dividend Estimator -->
            <div class="col-lg-6">
                <div class="card h-100 border-0 rounded-4 shadow-sm p-4 p-md-4 position-relative overflow-hidden hover-shadow transition-all" style="background: linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 100%); border-top: 4px solid #10B981 !important;">
                    <div class="d-flex align-items-start gap-3">
                        <div class="rounded-4 p-3 d-flex align-items-center justify-content-center text-white flex-shrink-0 shadow-sm" style="width: 56px; height: 56px; background: linear-gradient(135deg, #059669 0%, #10B981 100%);">
                            <i class="bi bi-pie-chart-fill fs-4"></i>
                        </div>
                        <div class="flex-grow-1">
                            <h4 class="fw-bold text-navy mb-2">ประมาณการเงินปันผล & เฉลี่ยคืน</h4>
                            <p class="text-muted small mb-4">
                                จำลองผลตอบแทนรวมที่คุณจะได้รับจากทุนเรือนหุ้นและดอกเบี้ยเงินกู้สะสมรายปี ด้วยระบบจำลองคำนวณแบบ Real-time
                            </p>
                            <a href="<?= url('dividend-estimator') ?>" class="btn btn-success rounded-pill px-4 py-2 fw-semibold shadow-sm">
                                <i class="bi bi-calculator me-1"></i> ทดลองคำนวณปันผลทันที <i class="bi bi-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tool 2: Member Satisfaction Survey -->
            <div class="col-lg-6">
                <div class="card h-100 border-0 rounded-4 shadow-sm p-4 p-md-4 position-relative overflow-hidden hover-shadow transition-all" style="background: linear-gradient(135deg, #FFFFFF 0%, #EFF6FF 100%); border-top: 4px solid #3B82F6 !important;">
                    <div class="d-flex align-items-start gap-3">
                        <div class="rounded-4 p-3 d-flex align-items-center justify-content-center text-white flex-shrink-0 shadow-sm" style="width: 56px; height: 56px; background: linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%);">
                            <i class="bi bi-chat-heart-fill fs-4"></i>
                        </div>
                        <div class="flex-grow-1">
                            <h4 class="fw-bold text-navy mb-2">แบบสำรวจความพึงพอใจ 2569</h4>
                            <p class="text-muted small mb-4">
                                ร่วมสะท้อนความคิดเห็นและประเมินคุณภาพการให้บริการ เพื่อร่วมเป็นส่วนหนึ่งในการพัฒนาและยกระดับสิทธิประโยชน์ของสมาชิก
                            </p>
                            <a href="<?= url('surveys/member-satisfaction-2569') ?>" class="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm">
                                <i class="bi bi-pencil-square me-1"></i> ร่วมตอบแบบสำรวจ (CSAT) <i class="bi bi-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- 5. Executive Financial Highlights Section -->
<?php if (!empty($latestStats)): ?>
    <section class="stats-section">
        <div class="container-xl position-relative z-2">
            <div class="text-center mb-5">
                <span class="badge bg-gold text-white px-3 py-1 rounded-pill mb-2">สถิติทางการเงิน</span>
                <h2 class="text-white fw-bold">ฐานะทางการเงินที่มั่นคงและเติบโตอย่างยั่งยืน</h2>
                <p class="text-light-blue small mb-0">ข้อมูล ณ เดือนมิถุนายน <?= e($latestStats['year']) ?></p>
            </div>

            <div class="row g-4">
                <div class="col-lg-3 col-6">
                    <div class="card bg-white border-0 rounded-4 shadow-sm p-4 text-center h-100 hover-lift">
                        <div class="d-inline-flex align-items-center justify-content-center rounded-circle mx-auto mb-3" style="width: 52px; height: 52px; background: rgba(7, 59, 116, 0.08); color: var(--coop-navy);">
                            <i class="bi bi-people-fill fs-4"></i>
                        </div>
                        <div class="h3 fw-bold text-navy mb-1"><?= number_format($latestStats['total_members']) ?></div>
                        <div class="text-muted small fw-medium">สมาชิกทั้งหมด (คน)</div>
                    </div>
                </div>
                <div class="col-lg-3 col-6">
                    <div class="card bg-white border-0 rounded-4 shadow-sm p-4 text-center h-100 hover-lift">
                        <div class="d-inline-flex align-items-center justify-content-center rounded-circle mx-auto mb-3" style="width: 52px; height: 52px; background: rgba(11, 94, 215, 0.08); color: var(--coop-blue);">
                            <i class="bi bi-wallet2 fs-4"></i>
                        </div>
                        <div class="h3 fw-bold text-navy mb-1"><?= number_format((float)$latestStats['total_assets'] / 1000000000, 2) ?> พันล้าน</div>
                        <div class="text-muted small fw-medium">สินทรัพย์รวม (บาท)</div>
                    </div>
                </div>
                <div class="col-lg-3 col-6">
                    <div class="card bg-white border-0 rounded-4 shadow-sm p-4 text-center h-100 hover-lift">
                        <div class="d-inline-flex align-items-center justify-content-center rounded-circle mx-auto mb-3" style="width: 52px; height: 52px; background: rgba(16, 185, 129, 0.1); color: #059669;">
                            <i class="bi bi-piggy-bank fs-4"></i>
                        </div>
                        <div class="h3 fw-bold text-navy mb-1"><?= number_format((float)$latestStats['total_deposits'] / 1000000000, 2) ?> พันล้าน</div>
                        <div class="text-muted small fw-medium">เงินฝากรวม (บาท)</div>
                    </div>
                </div>
                <div class="col-lg-3 col-6">
                    <div class="card bg-white border-0 rounded-4 shadow-sm p-4 text-center h-100 hover-lift">
                        <div class="d-inline-flex align-items-center justify-content-center rounded-circle mx-auto mb-3" style="width: 52px; height: 52px; background: rgba(217, 119, 6, 0.1); color: #d97706;">
                            <i class="bi bi-award-fill fs-4"></i>
                        </div>
                        <div class="h3 fw-bold text-gold mb-1"><?= number_format((float)$latestStats['dividend_rate'], 2) ?>%</div>
                        <div class="text-muted small fw-medium">อัตราเงินปันผลล่าสุด</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
<?php endif; ?>

<!-- 6. Latest News & Announcements Section -->
<section class="py-5">
    <div class="container-xl">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <span class="text-gold fw-bold text-uppercase small"><i class="bi bi-newspaper me-1"></i> ข่าวสารและกิจกรรม</span>
                <h2 class="fw-bold text-navy mb-0">ข่าวประชาสัมพันธ์ล่าสุด</h2>
            </div>
            <a href="<?= url('news') ?>" class="btn btn-outline-primary btn-sm">
                ดูข่าวทั้งหมด <i class="bi bi-chevron-right ms-1"></i>
            </a>
        </div>

        <div class="row g-4">
            <?php foreach ($latestNews as $news): ?>
                <div class="col-lg-4 col-md-6">
                    <div class="coop-card h-100 d-flex flex-column">
                        <div class="position-relative bg-light" style="height: 200px; overflow: hidden;">
                            <?php
                            $newsThumb = !empty($news['thumbnail']) ? storage_url($news['thumbnail']) : (!empty($news['featured_image']) ? storage_url($news['featured_image']) : asset('img/news_placeholder.jpg'));
                            ?>
                            <img src="<?= $newsThumb ?>" onerror="this.onerror=null; this.src='<?= asset('img/news_placeholder.jpg') ?>';" class="w-100 h-100 object-fit-cover" alt="<?= e($news['title']) ?>">
                            <span class="position-absolute top-0 start-0 m-3 badge bg-navy">
                                <?= e($news['category_name']) ?>
                            </span>
                        </div>
                        <div class="p-4 d-flex flex-column flex-grow-1">
                            <div class="text-muted small mb-2">
                                <i class="bi bi-calendar3 me-1"></i> <?= thai_date($news['publish_at']) ?>
                            </div>
                            <h5 class="fw-bold text-navy mb-2 line-clamp-2">
                                <a href="<?= url('news/' . $news['slug']) ?>" class="text-navy text-decoration-none">
                                    <?= e($news['title']) ?>
                                </a>
                            </h5>
                            <p class="text-muted small flex-grow-1 line-clamp-3">
                                <?= e($news['summary'] ?? strip_tags($news['content'] ?? '')) ?>
                            </p>
                            <div class="pt-3 border-top mt-auto">
                                <a href="<?= url('news/' . $news['slug']) ?>" class="btn btn-sm btn-link p-0 text-primary fw-semibold">
                                    อ่านรายละเอียด <i class="bi bi-arrow-right ms-1"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- 6.1 Upcoming Events & Important Schedule Section -->
<?php if (!empty($upcomingEvents)): ?>
    <section class="py-5 bg-white border-top border-bottom">
        <div class="container-xl">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <span class="text-primary fw-bold text-uppercase small"><i class="bi bi-calendar-event me-1"></i> ปฏิทินและกำหนดการ</span>
                    <h2 class="fw-bold text-navy mb-0">กำหนดการและกิจกรรมสำคัญเร็ว ๆ นี้</h2>
                </div>
                <a href="<?= url('calendar') ?>" class="btn btn-outline-primary btn-sm rounded-pill px-3">
                    ดูปฏิทินทั้งหมด <i class="bi bi-chevron-right ms-1"></i>
                </a>
            </div>

            <div class="row g-3">
                <?php
                $catIcons = [
                    'meeting' => ['icon' => 'bi-people-fill', 'bg' => '#EFF6FF', 'color' => '#1D4ED8'],
                    'loan_window' => ['icon' => 'bi-cash-coin', 'bg' => '#ECFDF5', 'color' => '#047857'],
                    'dividend' => ['icon' => 'bi-gift-fill', 'bg' => '#FEF3C7', 'color' => '#B45309'],
                    'holiday' => ['icon' => 'bi-slash-circle-fill', 'bg' => '#FEE2E2', 'color' => '#B91C1C'],
                    'activity' => ['icon' => 'bi-calendar-check', 'bg' => '#F3E8FF', 'color' => '#6D28D9'],
                ];
                foreach ($upcomingEvents as $evt):
                    $cfg = $catIcons[$evt['category'] ?? 'activity'] ?? $catIcons['activity'];
                    $eDate = strtotime($evt['start_date']);
                    $thaiDay = date('j', $eDate);
                    $thaiMonth = thai_month((int)date('n', $eDate));
                ?>
                    <div class="col-lg-3 col-md-6">
                        <div class="card h-100 border-0 rounded-4 shadow-sm p-3 hover-shadow transition-all" style="background-color: #F8FAFC;">
                            <div class="d-flex align-items-start gap-3">
                                <div class="rounded-3 text-center p-2 flex-shrink-0" style="background: <?= $cfg['bg'] ?>; color: <?= $cfg['color'] ?>; min-width: 58px;">
                                    <div class="fw-bold fs-4 lh-1"><?= $thaiDay ?></div>
                                    <div class="small fw-semibold lh-1 mt-1"><?= $thaiMonth ?></div>
                                </div>
                                <div class="flex-grow-1">
                                    <h6 class="fw-bold text-navy mb-1 line-clamp-2"><?= e($evt['title']) ?></h6>
                                    <div class="small text-muted mb-1">
                                        <i class="bi bi-clock me-1"></i>
                                        <?= !empty($evt['is_all_day']) ? 'ตลอดทั้งวัน' : (!empty($evt['start_time']) ? substr($evt['start_time'], 0, 5) . ' น.' : 'ตามกำหนดการ') ?>
                                    </div>
                                    <?php if (!empty($evt['location'])): ?>
                                        <div class="small text-muted text-truncate" style="max-width: 170px;">
                                            <i class="bi bi-geo-alt me-1"></i> <?= e($evt['location']) ?>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
<?php endif; ?>

<!-- 7. E-Service Gateway Section -->
<section class="py-5 bg-light">
    <div class="container-xl">
        <div class="text-center mb-5">
            <span class="text-gold fw-bold text-uppercase small"><i class="bi bi-grid me-1"></i> บริการออนไลน์</span>
            <h2 class="fw-bold text-navy mb-2">ศูนย์บริการดิจิทัลสำหรับสมาชิก (E-Service)</h2>
            <p class="text-muted">เชื่อมต่อระบบบริการข้อมูลสมาชิก สวัสดิการ และการเงิน สะดวก รวดเร็ว ตลอด 24 ชั่วโมง</p>
        </div>

        <div class="row g-4">
            <?php foreach ($eservices as $es): ?>
                <div class="col-lg-4 col-md-6">
                    <a href="<?= e($es['url']) ?>" class="text-decoration-none" data-confirm-external="<?= $es['confirm_before_redirect'] ?>" data-service-name="<?= e($es['name']) ?>">
                        <div class="coop-card p-4 h-100 d-flex align-items-start">
                            <div class="quick-service-icon me-3 flex-shrink-0">
                                <i class="bi <?= e($es['icon']) ?>"></i>
                            </div>
                            <div>
                                <h6 class="fw-bold text-navy mb-1"><?= e($es['name']) ?></h6>
                                <p class="text-muted small mb-2"><?= e($es['description']) ?></p>
                                <span class="badge bg-light text-primary border border-primary border-opacity-25 small">
                                    เข้าใช้งาน <i class="bi bi-box-arrow-up-right ms-1"></i>
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Swiper Initialization -->
<script>
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof Swiper !== 'undefined') {
            new Swiper('.hero-swiper', {
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },
                speed: 700,
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                }
            });
        }
    });
</script>