 const addBtn = document.getElementById('addBtn');
    const statsBtn = document.getElementById('statsBtn');
    const formPopup = document.getElementById('formPopup');
    const statsPopup = document.getElementById('statsPopup');
    const closeFormBtn = formPopup.querySelector('.closeBtn');
    const closeStatsBtn = statsPopup.querySelector('.closeBtn');
    const bookForm = document.getElementById('bookForm');
    const bookList = document.getElementById('bookList');
    const bookDetailPopup = document.getElementById('bookDetailPopup');
    const bookDetailContent = document.getElementById('bookDetailContent');
    const closeBookDetailBtn = bookDetailPopup.querySelector('.closeBtn');

    let books = [];
    let uploadedBookPic = '';
    let editingIndex = -1;

    // --- Persistence ---
    function saveBooks() {
      localStorage.setItem('bookLogBooks', JSON.stringify(books));
    }
    function loadBooks() {
      const data = localStorage.getItem('bookLogBooks');
      if (data) books = JSON.parse(data);
    }

    document.getElementById('bookPicture').addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          uploadedBookPic = evt.target.result;
          document.getElementById('bookPicPreview').src = uploadedBookPic;
          document.getElementById('bookPicPreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        uploadedBookPic = '';
        document.getElementById('bookPicPreview').style.display = 'none';
      }
    });

    function openForm() {
      formPopup.classList.add('active');
      formPopup.setAttribute('aria-hidden', 'false');
      bookForm.reset();
      uploadedBookPic = '';
      document.getElementById('bookPicPreview').style.display = 'none';
      formPopup.querySelector('h2').textContent = 'Add New Book'; 
      bookForm.querySelector('.submitBtn').textContent = 'Add Book';
    }

    function openEditForm(index) {
      const book = books[index];
      editingIndex = index;

      bookForm.bookName.value = book.bookName;
      bookForm.authorName.value = book.authorName;
      bookForm.genre.value = book.genre;
      bookForm.startDate.value = book.startDate;
      bookForm.endDate.value = book.endDate;
      bookForm.pages.value = book.pages;
      bookForm.overallRating.value = book.overallRating;
      bookForm.favoriteQuote.value = book.favoriteQuote || '';
      bookForm.favoriteCharacter.value = book.favoriteCharacter || '';
      bookForm.favoriteScene.value = book.favoriteScene || '';
      bookForm.writingQuality.value = book.writingQuality || '';
      bookForm.characterRating.value = book.characterRating || '';
      bookForm.plotRating.value = book.plotRating || '';
      bookForm.endingRating.value = book.endingRating || '';
      bookForm.tearRating.value = book.tearRating || '';
      bookForm.spiceRating.value = book.spiceRating || '';
      bookForm.finalThoughts.value = book.finalThoughts || '';
      bookForm.wouldRecommend.checked = !!book.wouldRecommend;

      // Set radio for bookType
      if (book.bookType) {
        const radios = bookForm.querySelectorAll('input[name="bookType"]');
        radios.forEach(radio => {
          radio.checked = (radio.value === book.bookType);
        });
      }

      uploadedBookPic = book.bookPicture || '';
      if (uploadedBookPic) {
        document.getElementById('bookPicPreview').src = uploadedBookPic;
        document.getElementById('bookPicPreview').style.display = 'block';
      } else {
        document.getElementById('bookPicPreview').style.display = 'none';
      }
      formPopup.querySelector('h2').textContent = 'Edit Book';
      bookForm.querySelector('.submitBtn').textContent = 'Edit Book';
      formPopup.classList.add('active');
      formPopup.setAttribute('aria-hidden', 'false');
    }

    function closeForm() {
      formPopup.classList.remove('active');
      formPopup.setAttribute('aria-hidden', 'true');
    }

    function openStatsPopup() {
      statsPopup.classList.add('active');
      statsPopup.setAttribute('aria-hidden', 'false');
      renderStats();
    }

    function closeStats() {
      statsPopup.classList.remove('active');
      statsPopup.setAttribute('aria-hidden', 'true');
    }

    function openBookPopup(index) {
  const book = books[index];

  // Book picture panel
  const picPanel = document.getElementById('bookDetailPicPanel');
  picPanel.innerHTML = book.bookPicture
    ? `<img src="${book.bookPicture}" alt="Book Picture" />`
    : `<div class="noPic"></div>`;

  // Heading
  document.getElementById('bookDetailHeading').textContent = book.bookName;

  // Info Section
  document.getElementById('bookDetailInfo').innerHTML = `
    <ul class="bookDetailInfoList">
      <li><strong>Author:</strong> ${escapeHTML(book.authorName)}</li>
      <li><strong>Genre:</strong> ${escapeHTML(book.genre)}</li>
      <li><strong>Pages:</strong> ${book.pages}</li>
      <li><strong>Format:</strong> ${escapeHTML(book.bookType)}</li>
      <li><strong>Start Date:</strong> ${book.startDate}</li>
      <li><strong>End Date:</strong> ${book.endDate}</li>
      <li><strong>Recommended:</strong> ${book.wouldRecommend ? 'Yes' : 'No'}</li>
    </ul>
  `;

  // Details Section
  document.getElementById('bookDetailDetails').innerHTML = `
    ${book.favoriteQuote ? `<div class="bookDetailQuote">"&nbsp;${escapeHTML(book.favoriteQuote)}&nbsp;"</div>` : ''}
    <ul class="bookDetailInfoList">
      <li><strong>Favorite Side Character:</strong> ${escapeHTML(book.favoriteCharacter)}</li>
      <li><strong>Favorite Scene:</strong> ${escapeHTML(book.favoriteScene)}</li>
      <li><strong>Final Thoughts:</strong> ${escapeHTML(book.finalThoughts)}</li>
    </ul>
  `;

  // Ratings Section
  function getIconRating(rating, max, icon, filledClass, emptyClass, halfClass = '') {
  let html = '';
  for (let i = 1; i <= max; i++) {
    if (rating >= i) {
      html += `<i class="${icon} ${filledClass}"></i>`;
    } else if (halfClass && rating >= i - 0.5) {
      // For half values, show a half icon if available
      if (icon.includes('star')) {
        html += `<i class="fa-solid fa-star-half-stroke ${halfClass}"></i>`;
      } else if (icon.includes('droplet')) {
        html += `<i class="fa-solid fa-droplet-half ${halfClass}"></i>`;
      } else if (icon.includes('fire')) {
        html += `<i class="fa-solid fa-fire-half ${halfClass}"></i>`;
      } else {
        html += `<i class="${icon} ${halfClass}"></i>`;
      }
    } else {
      html += `<i class="${icon} ${emptyClass}"></i>`;
    }
  }
  return html;
}

document.getElementById('bookDetailRatings').innerHTML = `
  <ul class="bookDetailRatingsList">
    <li>
      <strong>Overall Rating:</strong>
      <span class="icon-rating">
        ${getIconRating(Number(book.overallRating), 5, 'fa-solid fa-star', 'star-filled', 'star-empty', 'star-half')}
        <span style="margin-left:6px; color:#888; font-size:0.98em;">${book.overallRating ? Number(book.overallRating).toFixed(1) : '-'}/5</span>
      </span>
    </li>
    <li>
      <strong>Tear Rating:</strong>
      <span class="icon-rating">
        ${getIconRating(Number(book.tearRating) || 0, 5, 'fa-solid fa-droplet', 'tear-filled', 'tear-empty', 'tear-half')}
        <span style="margin-left:6px; color:#888; font-size:0.98em;">${book.tearRating ? Number(book.tearRating).toFixed(1) : '-'}/5</span>
      </span>
    </li>
    <li>
      <strong>Spice Rating:</strong>
      <span class="icon-rating">
        ${getIconRating(Number(book.spiceRating) || 0, 5, 'fa-solid fa-fire', 'spice-filled', 'spice-empty', 'spice-half')}
        <span style="margin-left:6px; color:#888; font-size:0.98em;">${book.spiceRating ? Number(book.spiceRating).toFixed(1) : '-'}/5</span>
      </span>
    </li>
  </ul>
  <div class="bookDetailRatingsGrid">
    <div>
      <div class="grid-rating-label">Character Rating</div>
      <div class="grid-rating-value">${book.characterRating ? Number(book.characterRating).toFixed(1) : '-'}/10</div>
    </div>
    <div>
      <div class="grid-rating-label">Plot Development</div>
      <div class="grid-rating-value">${book.plotRating ? Number(book.plotRating).toFixed(1) : '-'}/10</div>
    </div>
    <div>
      <div class="grid-rating-label">Ending Rating</div>
      <div class="grid-rating-value">${book.endingRating ? Number(book.endingRating).toFixed(1) : '-'}/10</div>
    </div>
    <div>
      <div class="grid-rating-label">Writing Quality</div>
      <div class="grid-rating-value">${book.writingQuality ? Number(book.writingQuality).toFixed(1) : '-'}/10</div>
    </div>
  </div>
`;

document.getElementById('bookDetailRatings').innerHTML = `
  <ul class="bookDetailRatingsList">
    <li>
      <strong>Overall Rating:</strong>
      <span class="icon-rating">
        ${getIconRating(Number(book.overallRating), 5, 'fa-solid fa-star', 'star-filled', 'star-empty')}
      </span>
    </li>
    <li>
      <strong>Tear Rating:</strong>
      <span class="icon-rating">
        ${getIconRating(Number(book.tearRating) || 0, 5, 'fa-solid fa-droplet', 'tear-filled', 'tear-empty')}
      </span>
    </li>
    <li>
      <strong>Spice Rating:</strong>
      <span class="icon-rating">
        ${getIconRating(Number(book.spiceRating) || 0, 5, 'fa-solid fa-fire', 'spice-filled', 'spice-empty')}
      </span>
    </li>
  </ul>
  <div class="bookDetailRatingsGrid">
    <div>
      <div class="grid-rating-label">Character Rating</div>
      <div class="grid-rating-value">${book.characterRating || '-'}/10</div>
    </div>
    <div>
      <div class="grid-rating-label">Plot Development</div>
      <div class="grid-rating-value">${book.plotRating || '-'}/10</div>
    </div>
    <div>
      <div class="grid-rating-label">Ending Rating</div>
      <div class="grid-rating-value">${book.endingRating || '-'}/10</div>
    </div>
    <div>
      <div class="grid-rating-label">Writing Quality</div>
      <div class="grid-rating-value">${book.writingQuality || '-'}/10</div>
    </div>
  </div>
`;

  // Tab navigation logic
  const tabs = document.querySelectorAll('.bookDetailTab');
  const sections = {
    info: document.getElementById('bookDetailInfo'),
    details: document.getElementById('bookDetailDetails'),
    ratings: document.getElementById('bookDetailRatings')
  };
  tabs.forEach(tab => {
    tab.classList.remove('active');
    sections[tab.dataset.tab].classList.remove('active');
    tab.onclick = function() {
      tabs.forEach(t => t.classList.remove('active'));
      Object.values(sections).forEach(sec => sec.classList.remove('active'));
      tab.classList.add('active');
      sections[tab.dataset.tab].classList.add('active');
    };
  });
  // Set Info as default active
  tabs[0].classList.add('active');
  sections.info.classList.add('active');

  bookDetailPopup.classList.add('active');
  bookDetailPopup.setAttribute('aria-hidden', 'false');
}

    function renderBooks() {
      bookList.innerHTML = '';
      if (books.length === 0) {
        bookList.innerHTML = '<p class="emptyMessage">No books logged yet.</p>';
        return;
      }
      books.forEach((book, index) => {
        const btn = document.createElement('div');
        btn.className = 'bookGridBtn';
        btn.setAttribute('data-index', index);

        btn.innerHTML = `
          <div class="bookGridPic">
            ${book.bookPicture ? `<img src="${book.bookPicture}" alt="Book Picture" />` : `<div class="noPic"></div>`}
          </div>
          <div class="bookGridInfo">
            <strong>${escapeHTML(book.bookName)}</strong><br/>
            <span>${escapeHTML(book.authorName)}</span><br/>
            <span>${escapeHTML(book.genre)}</span><br/>
            <span>${book.startDate} - ${book.endDate}</span>
          </div>
          <div class="bookActions" style="margin-top:10px; display:flex; gap:8px; justify-content:center;">
            <button class="editBtn" data-index="${index}" type="button">Edit</button>
            <button class="deleteBtn" data-index="${index}" type="button">Delete</button>
          </div>
        `;

        // Open popup on click (but not when clicking edit/delete)
        btn.addEventListener('click', e => {
          if (e.target.classList.contains('editBtn') || e.target.classList.contains('deleteBtn')) return;
          openBookPopup(index);
        });

        // Edit button
        btn.querySelector('.editBtn').addEventListener('click', e => {
          e.stopPropagation();
          openEditForm(index);
        });

        // Delete button
        btn.querySelector('.deleteBtn').addEventListener('click', e => {
          e.stopPropagation();
          if (confirm(`Are you sure you want to delete "${books[index].bookName}"?`)) {
            books.splice(index, 1);
            saveBooks();
            renderBooks();
          }
        });

        bookList.appendChild(btn);
      });
    }

    bookForm.addEventListener('submit', e => {
      e.preventDefault();

      const formData = new FormData(bookForm);

      // Required fields
      const bookName = formData.get('bookName')?.trim();
      const authorName = formData.get('authorName')?.trim();
      const genre = formData.get('genre')?.trim();
      const bookType = formData.get('bookType');
      const pages = formData.get('pages');
      const startDate = formData.get('startDate');
      const endDate = formData.get('endDate');
      const overallRating = formData.get('overallRating');

      // Optional fields
      const favoriteQuote = formData.get('favoriteQuote')?.trim();
      const favoriteCharacter = formData.get('favoriteCharacter')?.trim();
      const favoriteScene = formData.get('favoriteScene')?.trim();
      const writingQuality = formData.get('writingQuality');
      const characterRating = formData.get('characterRating');
      const plotRating = formData.get('plotRating');
      const endingRating = formData.get('endingRating');
      const tearRating = formData.get('tearRating');
      const spiceRating = formData.get('spiceRating');
      const finalThoughts = formData.get('finalThoughts')?.trim();
      const wouldRecommend = formData.get('wouldRecommend') === 'on';

      // Validate required fields
      if (!bookName || !authorName || !genre || !bookType || !pages || !startDate || !endDate || !overallRating) {
        alert('Please fill in all required fields.');
        return;
      }

      if (!validateDates(startDate, endDate)) {
        alert('End Date cannot be before Start Date.');
        return;
      }

      // Collect additional reads (if any)
      const additionalReads = [];
      document.querySelectorAll('.additionalReadBlock').forEach(block => {
        const type = block.querySelector('input[type="radio"]:checked')?.value || '';
        const additionalStart = block.querySelector('input[name="additionalStart[]"]')?.value || '';
        const additionalEnd = block.querySelector('input[name="additionalEnd[]"]')?.value || '';
        if (type || additionalStart || additionalEnd) {
          additionalReads.push({ type, additionalStart, additionalEnd });
        }
      });

      const bookData = {
        bookName,
        authorName,
        genre,
        bookType,
        pages,
        startDate,
        endDate,
        overallRating,
        favoriteQuote,
        favoriteCharacter,
        favoriteScene,
        writingQuality,
        characterRating,
        plotRating,
        endingRating,
        tearRating,
        spiceRating,
        finalThoughts,
        wouldRecommend,
        additionalReads,
        bookPicture: uploadedBookPic
      };

      if (editingIndex === -1) {
        books.push(bookData);
      } else {
        books[editingIndex] = bookData;
        editingIndex = -1;
      }
      saveBooks();
      renderBooks();
      closeForm();
    });

    // Escape HTML to prevent injection
    function escapeHTML(str) {
      if (!str) return '';
      return str.replace(/[&<>"']/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[tag] || tag);
    }

    // Validate dates (end >= start)
    function validateDates(start, end) {
      return new Date(end) >= new Date(start);
    }
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("endDate").setAttribute("max", today);
    document.getElementById("startDate").setAttribute("max", today);

    // Close popup on clicking close buttons
    closeFormBtn.addEventListener('click', closeForm);
    closeStatsBtn.addEventListener('click', closeStats);
    closeBookDetailBtn.addEventListener('click', () => {
      bookDetailPopup.classList.remove('active');
      bookDetailPopup.setAttribute('aria-hidden', 'true');
    });

    // Open form or stats on button clicks
    addBtn.addEventListener('click', () => {
      editingIndex = -1;
      openForm();
    });

    statsBtn.addEventListener('click', openStatsPopup);

let statsChart = null;

function renderStats(tab = "author") {
  const statsContent = document.getElementById('statsContent');
  if (statsChart) {
    statsChart.destroy();
  }

  if (books.length === 0) {
    statsContent.innerHTML = '<p style="text-align:center;">No books to display statistics.</p>';
    return;
  }

  // Section headings/subheadings
  let sectionHeading = '', sectionSubheading = '';
  if (tab === "author") {
    sectionHeading = 'Most read authors';
    sectionSubheading = "Authors you've read the most books from";
  } else if (tab === "genre") {
    sectionHeading = 'Genre distribution';
    sectionSubheading = 'Types of books you read most often';
  } else if (tab === "monthly") {
    sectionHeading = 'Monthly Reading Activity';
    sectionSubheading = 'In which month did you read the most?';
  }

  statsContent.innerHTML = `
    <div>
      <div id="statsSectionHeading">${sectionHeading}</div>
      <div id="statsSectionSubheading">${sectionSubheading}</div>
      <canvas id="statsChart" width="350" height="300"></canvas>
    </div>
  `;

  const ctx = document.getElementById('statsChart').getContext('2d');

  // Pastel color palette
  const pastelColors = [
    '#ffd6e0', '#b5ead7', '#c7ceea', '#f7cac9', '#f9e79f', '#b2dfdb', '#f3c6e8',
    '#f6dfeb', '#e2f0cb', '#f9cb9c', '#d6eaff', '#ffe0ac', '#c2f0fc'
  ];

  if (tab === "author") {
    const authorCount = {};
    books.forEach(book => {
      const a = book.authorName.trim();
      authorCount[a] = (authorCount[a] || 0) + 1;
    });
    const labels = Object.keys(authorCount);
    const data = Object.values(authorCount);
    statsChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: pastelColors.slice(0, labels.length)
        }]
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            align: 'end',
            labels: {
              boxWidth: 18,
              boxHeight: 18,
              padding: 18,
              color: '#6d6d7b',
              font: { size: 14 }
            }
          },
          title: { display: false }
        }
      }
    });
  } else if (tab === "genre") {
    const genreCount = {};
    books.forEach(book => {
      const g = book.genre.trim();
      genreCount[g] = (genreCount[g] || 0) + 1;
    });
    const labels = Object.keys(genreCount);
    const data = Object.values(genreCount);
    statsChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: pastelColors.slice(0, labels.length)
        }]
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            align: 'end',
            labels: {
              boxWidth: 18,
              boxHeight: 18,
              padding: 18,
              color: '#6d6d7b',
              font: { size: 14 }
            }
          },
          title: { display: false }
        }
      }
    });
  } else if (tab === "monthly") {
    const monthCount = {};
    books.forEach(book => {
      let month = '';
      if (book.endDate) {
        month = book.endDate.slice(0, 7); // YYYY-MM
      }
      if (month) {
        monthCount[month] = (monthCount[month] || 0) + 1;
      }
    });
    const labels = Object.keys(monthCount).sort();
    const data = labels.map(m => monthCount[m]);
    statsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Books Read',
          data,
          backgroundColor: pastelColors[2]
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          title: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            precision: 0,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  }
}

// Tab navigation logic
document.addEventListener('DOMContentLoaded', function() {
  const nav = document.getElementById('statsNav');
  if (nav) {
    nav.addEventListener('click', function(e) {
      if (e.target.classList.contains('statsTab')) {
        document.querySelectorAll('.statsTab').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        renderStats(e.target.dataset.tab);
      }
    });
  }
});

// When opening stats popup, always show author tab by default
function openStatsPopup() {
  statsPopup.classList.add('active');
  statsPopup.setAttribute('aria-hidden', 'false');
  document.querySelectorAll('.statsTab').forEach(btn => btn.classList.remove('active'));
  document.querySelector('.statsTab[data-tab="author"]').classList.add('active');
  renderStats("author");
}


// Tab navigation logic
document.addEventListener('DOMContentLoaded', function() {
  const nav = document.getElementById('statsNav');
  if (nav) {
    nav.addEventListener('click', function(e) {
      if (e.target.classList.contains('statsTab')) {
        document.querySelectorAll('.statsTab').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        renderStats(e.target.dataset.tab);
      }
    });
  }
});

// When opening stats popup, always show author tab by default
function openStatsPopup() {
  statsPopup.classList.add('active');
  statsPopup.setAttribute('aria-hidden', 'false');
  document.querySelectorAll('.statsTab').forEach(btn => btn.classList.remove('active'));
  document.querySelector('.statsTab[data-tab="author"]').classList.add('active');
  renderStats("author");
}

    function addAdditionalRead() {
      const container = document.getElementById('additionalReadsContainer');
      const div = document.createElement('div');
      div.innerHTML = `
        <div class="additionalReadBlock" style="position:relative; padding:10px; border:1px solid #ccc; border-radius:8px; margin-top:10px;">
          <button class="closeAdditionalBtn" style="position:absolute; top:5px; right:10px; background:none; border:none; font-size:18px; cursor:pointer; color:#888;">&times;</button>
          <label>Book Type</label>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <label><input type="radio" name="bookType" value="Physical" /> Physical</label>
            <label><input type="radio" name="bookType" value="Audio" /> Audio Book</label>
            <label><input type="radio" name="bookType" value="Ebook" /> E-book</label>
          </div>
          <input type="date" name="additionalStart[]" placeholder="Start Date" />
          <input type="date" name="additionalEnd[]" placeholder="End Date" />
        </div>
      `;
      container.appendChild(div);
      div.querySelector('.closeAdditionalBtn').addEventListener('click', function () {
        div.remove();
      });
    }

    document.getElementById('addMoreReadsBtn').addEventListener('click', addAdditionalRead);

    // Load books from localStorage and render on page load
    loadBooks();
    renderBooks();

    // Close popups when clicking outside
document.addEventListener('mousedown', function(event) {
  // Form Popup
  if (formPopup.classList.contains('active') && !formPopup.contains(event.target) && !addBtn.contains(event.target)) {
    closeForm();
  }
  // Stats Popup
  if (statsPopup.classList.contains('active') && !statsPopup.contains(event.target) && !statsBtn.contains(event.target)) {
    closeStats();
  }
  // Book Detail Popup
  if (bookDetailPopup.classList.contains('active') && !bookDetailPopup.contains(event.target)) {
    bookDetailPopup.classList.remove('active');
    bookDetailPopup.setAttribute('aria-hidden', 'true');
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const darkModeIcon = darkModeToggle.querySelector('i');

  // Load dark mode preference
  if (localStorage.getItem('bookLogDarkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeIcon.classList.remove('fa-moon');
    darkModeIcon.classList.add('fa-sun');
  }

  // Toggle dark mode
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('bookLogDarkMode', isDark);
    if (isDark) {
      darkModeIcon.classList.remove('fa-moon');
      darkModeIcon.classList.add('fa-sun');
    } else {
      darkModeIcon.classList.remove('fa-sun');
      darkModeIcon.classList.add('fa-moon');
    }
  });
});