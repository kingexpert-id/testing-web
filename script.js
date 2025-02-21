function toggleFAQ(selectedQuestion) {
    const faq = selectedQuestion.closest(".faq"); // Ambil elemen FAQ terdekat
    const answer = faq.querySelector(".faq-answer"); // Ambil elemen jawaban
    const icon = faq.querySelector(".faq-icon"); // Ambil elemen ikon

    // Tutup semua FAQ yang terbuka kecuali yang sedang diklik
    document.querySelectorAll(".faq").forEach(otherFaq => {
        if (otherFaq !== faq) {
            otherFaq.querySelector(".faq-answer").classList.remove("open");
            otherFaq.querySelector(".faq-icon").textContent = "+";
        }
    });

    // Buka atau tutup FAQ yang diklik
    if (answer.classList.contains("open")) {
        answer.classList.remove("open");
        icon.textContent = "+";
    } else {
        answer.classList.add("open");
        icon.textContent = "-";
    }
};


// Script untuk Smooth Scroll dan Efek Muncul
        // Smooth Scroll
document.querySelectorAll('.smooth-scroll').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
                window.scrollTo({
                    top: target.offsetTop - 110, // Jarak dari navigasi
                    behavior: 'smooth'
                });
            });
        });
        // Intersection Observer untuk memantau elemen
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Tambahkan kelas 'visible' saat elemen masuk viewport
                    entry.target.classList.add('visible');
                } else {
                    // Hapus kelas 'visible' saat elemen keluar viewport
                    entry.target.classList.remove('visible');
                }
            });
        });

        // Amati semua elemen <section>
document.querySelectorAll('section').forEach((section) => {
            observer.observe(section);
        });