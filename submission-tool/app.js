// Sutton Funding Submission Tool - Main Application
class SubmissionTool {
      constructor() {
                this.deal = null;
                this.lenders = [];
                this.selectedLenders = new Set();
                this.existingAttachments = [];
                this.newAttachments = [];
                this.ccEmails = [];
                this.init();
      }

    async init() {
              this.showLoading();
              this.bindEvents();
              await this.loadData();
              this.hideLoading();
    }

    showLoading() { document.getElementById('loading').style.display = 'flex'; }
      hideLoading() { document.getElementById('loading').style.display = 'none'; }

    bindEvents() {
              // File upload
          const dropzone = document.getElementById('dropzone');
              const fileInput = document.getElementById('file-input');

          dropzone.addEventListener('click', () => fileInput.click());
              dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('dragover'); });
              dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
              dropzone.addEventListener('drop', e => { e.preventDefault(); dropzone.classList.remove('dragover'); this.handleFiles(e.dataTransfer.files); });
              fileInput.addEventListener('change', e => this.handleFiles(e.target.files));

          // Lender search
          document.getElementById('lender-search').addEventListener('input', e => this.filterLenders(e.target.value));

          // Select all
          document.getElementById('select-all-lenders').addEventListener('change', e => this.selectAllQualified(e.target.checked));

          // CC input
          document.getElementById('cc-input').addEventListener('keydown', e => {
                        if (e.key === 'Enter' && e.target.value) {
                                          e.preventDefault();
                                          this.addCcEmail(e.target.value);
                                          e.target.value = '';
                        }
          });

          // Submit
          document.getElementById('submit-btn').addEventListener('click', () => this.handleSubmit());
    }

    async loadData() {
              if (DEMO_MODE) {
                            this.deal = MOCK_DEAL;
                            this.lenders = MOCK_LENDERS;
              } else {
                            // Real API calls would go here
                  const dealId = new URLSearchParams(window.location.search).get('dealId') || 
                                               window.location.pathname.split('/').pop();
                            // this.deal = await fetch(`${CONFIG.API_BASE_URL}/deals/${dealId}`).then(r => r.json());
                  // this.lenders = await fetch(`${CONFIG.API_BASE_URL}/lenders`).then(r => r.json());
              }

          this.existingAttachments = this.deal.attachments || [];
              this.renderAll();
    }

    renderAll() {
              this.renderDealInfo();
              this.renderAttachments();
              this.renderLenders();
    }

    renderDealInfo() {
              document.getElementById('subject').value = 
                            this.deal.Account_Name?.label || `New Submission - ${this.deal.Business_Legal_Name}`;
    }

    renderAttachments() {
              const list = document.getElementById('existing-attachments');
              let total = 0;

          list.innerHTML = this.existingAttachments.map((att, idx) => {
                        total += att.Size || 0;
                        return `<li>
                                        <input type="checkbox" checked data-idx="${idx}">
                                                        <span>${att.File_Name} (${this.formatSize(att.Size)})</span>
                                                                        <button class="remove-btn" data-idx="${idx}">&times;</button>
                                                                                    </li>`;
          }).join('');

          document.getElementById('existing-total').textContent = this.formatSize(total);

          list.querySelectorAll('.remove-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                                          this.existingAttachments.splice(parseInt(btn.dataset.idx), 1);
                                          this.renderAttachments();
                        });
          });
    }

    renderNewAttachments() {
              const list = document.getElementById('new-attachments');
              let total = 0;

          list.innerHTML = this.newAttachments.map((file, idx) => {
                        total += file.size;
                        return `<li>
                                        <span>${file.name} (${this.formatSize(file.size)})</span>
                                                        <button class="remove-btn" data-idx="${idx}">&times;</button>
                                                                    </li>`;
          }).join('');

          document.getElementById('new-total').textContent = this.formatSize(total);

          list.querySelectorAll('.remove-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                                          this.newAttachments.splice(parseInt(btn.dataset.idx), 1);
                                          this.renderNewAttachments();
                        });
          });
    }

    renderLenders() {
              const tbody = document.getElementById('lender-tbody');
              tbody.innerHTML = this.lenders.map(lender => {
                            const criteria = this.evaluateCriteria(lender);
                            return `<tr data-id="${lender.id}" class="${this.selectedLenders.has(lender.id) ? 'selected' : ''}">
                                            <td><input type="checkbox" class="lender-cb" data-id="${lender.id}" ${this.selectedLenders.has(lender.id) ? 'checked' : ''}></td>
                                                            <td style="text-align:left">${lender.Vendor_Name}</td>
                                                                            <td>${this.statusIcon(criteria.tib)}</td>
                                                                                            <td>${this.statusIcon(criteria.credit)}</td>
                                                                                                            <td>${this.statusIcon(criteria.nsf)}</td>
                                                                                                                            <td>${this.statusIcon(criteria.adb)}</td>
                                                                                                                                            <td>${this.statusIcon(criteria.ownership)}</td>
                                                                                                                                                            <td>${this.statusIcon(criteria.deposits)}</td>
                                                                                                                                                                            <td>${this.statusIcon(criteria.industry)}</td>
                                                                                                                                                                                            <td>${this.statusIcon(criteria.state)}</td>
                                                                                                                                                                                                        </tr>`;
              }).join('');

          tbody.querySelectorAll('.lender-cb').forEach(cb => {
                        cb.addEventListener('change', e => {
                                          const id = e.target.dataset.id;
                                          if (e.target.checked) this.selectedLenders.add(id);
                                          else this.selectedLenders.delete(id);
                                          e.target.closest('tr').classList.toggle('selected', e.target.checked);
                        });
          });
    }

    evaluateCriteria(lender) {
              const d = this.deal;
              const creditScore = parseInt(String(d.Credit_Score).replace(/\D/g, '')) || 0;

          return {
                        tib: !lender.Minimun_Time_in_business || (d.Time_in_Business_Years || 0) >= lender.Minimun_Time_in_business,
                        credit: !lender.Minimun_Credit_score || creditScore >= lender.Minimun_Credit_score,
                        nsf: !lender.Max_NSF_Negative_Balance || (d.NSF_Negative_Balance || 0) <= lender.Max_NSF_Negative_Balance,
                        adb: !lender.Min_ADB_Avg_Daily_Balance || (d.ADB_Avg_Daily_Balance || 0) >= lender.Min_ADB_Avg_Daily_Balance,
                        ownership: !lender.Min_Ownership || (d.Ownership || 0) >= lender.Min_Ownership,
                        deposits: !lender.Min_Deposits_Monthly || (d.Deposits_Monthly || 0) >= lender.Min_Deposits_Monthly,
                        industry: !lender.Industry_Restrictions?.length || !lender.Industry_Restrictions.includes(d.Industry),
                        state: !lender.State_Restrictions?.length || !lender.State_Restrictions.includes(d.Business_Address_State)
          };
    }

    statusIcon(pass) {
              return pass 
              ? '<span class="status-pass"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>'
                            : '<span class="status-fail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>';
    }

    filterLenders(query) {
              document.querySelectorAll('#lender-tbody tr').forEach(row => {
                            const name = row.children[1]?.textContent.toLowerCase() || '';
                            row.style.display = name.includes(query.toLowerCase()) ? '' : 'none';
              });
    }

    selectAllQualified(select) {
              this.lenders.forEach(lender => {
                            const criteria = this.evaluateCriteria(lender);
                            if (Object.values(criteria).every(v => v)) {
                                              const cb = document.querySelector(`.lender-cb[data-id="${lender.id}"]`);
                                              if (cb) {
                                                                    cb.checked = select;
                                                                    if (select) this.selectedLenders.add(lender.id);
                                                                    else this.selectedLenders.delete(lender.id);
                                                                    cb.closest('tr').classList.toggle('selected', select);
                                              }
                            }
              });
    }

    handleFiles(files) {
              for (const file of files) {
                            const ext = '.' + file.name.split('.').pop().toLowerCase();
                            if (!CONFIG.ALLOWED_EXTENSIONS.includes(ext)) {
                                              alert(`Invalid file type: ${file.name}`);
                                              continue;
                            }
                            if (file.size > CONFIG.MAX_FILE_SIZE) {
                                              alert(`File too large: ${file.name} (max 5MB)`);
                                              continue;
                            }
                            this.newAttachments.push(file);
              }
              this.renderNewAttachments();
    }

    addCcEmail(email) {
              if (this.validateEmail(email) && !this.ccEmails.includes(email)) {
                            this.ccEmails.push(email);
                            this.renderCcTags();
              }
    }

    validateEmail(email) {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    renderCcTags() {
              document.getElementById('cc-tags').innerHTML = this.ccEmails.map((email, idx) => 
                                                                                           `<span class="cc-tag">${email}<button data-idx="${idx}">&times;</button></span>`
                                                                                       ).join('');

          document.querySelectorAll('#cc-tags button').forEach(btn => {
                        btn.addEventListener('click', () => {
                                          this.ccEmails.splice(parseInt(btn.dataset.idx), 1);
                                          this.renderCcTags();
                        });
          });
    }

    formatSize(bytes) {
              if (!bytes) return '0.00';
              return (bytes / (1024 * 1024)).toFixed(2);
    }

    async handleSubmit() {
              if (this.selectedLenders.size === 0) {
                            alert('Please select at least one lender');
                            return;
              }

          const selectedLenderData = this.lenders.filter(l => this.selectedLenders.has(l.id));
              const submission = {
                            dealId: this.deal.id,
                            subject: document.getElementById('subject').value,
                            notes: document.getElementById('notes').value,
                            attachments: this.existingAttachments.filter((_, i) => 
                                                                                         document.querySelector(`#existing-attachments input[data-idx="${i}"]`)?.checked
                                                                                     ),
                            newAttachments: this.newAttachments,
                            lenders: selectedLenderData,
                            ccEmails: this.ccEmails
              };

          console.log('Submission data:', submission);

          if (DEMO_MODE) {
                        alert(`Demo Mode: Would submit to ${selectedLenderData.length} lender(s):\n${selectedLenderData.map(l => l.Vendor_Name).join('\n')}`);
          } else {
                        // Real submission logic
                  this.showLoading();
                        try {
                                          // await fetch(`${CONFIG.API_BASE_URL}/submit`, { method: 'POST', body: JSON.stringify(submission) });
                            alert('Submission successful!');
                        } catch (e) {
                                          alert('Submission failed: ' + e.message);
                        }
                        this.hideLoading();
          }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => new SubmissionTool());
