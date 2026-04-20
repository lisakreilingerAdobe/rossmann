export default function decorate(block) {
  const rows = [...block.children];
  const heading = rows[0]?.textContent?.trim() || '';
  const subtitle = rows[1]?.textContent?.trim() || '';
  const buttonLabel = rows[2]?.textContent?.trim() || 'Foto hochladen';
  const acceptTypes = rows[3]?.textContent?.trim() || 'image/jpeg,image/png';

  block.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'photo-upload-cta-header';

  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading;
    header.append(h2);
  }

  if (subtitle) {
    const h3 = document.createElement('h3');
    h3.textContent = subtitle;
    header.append(h3);
  }

  block.append(header);

  const form = document.createElement('div');
  form.className = 'photo-upload-cta-form';

  const fileWrapper = document.createElement('div');
  fileWrapper.className = 'photo-upload-cta-file-wrapper';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = acceptTypes;
  fileInput.className = 'photo-upload-cta-file-input';
  fileWrapper.append(fileInput);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'photo-upload-cta-button';
  btn.textContent = buttonLabel;

  form.append(fileWrapper);
  form.append(btn);
  block.append(form);
}
