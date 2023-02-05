import './style.css';

const domElements = {
  form: document.querySelector('form'),
  success: document.querySelector('section'),
  reset: document.querySelector('#reset-button'),
  preview: {
    name: document.querySelector('#preview-name') as HTMLElement,
    cvc: document.querySelector('#preview-cvc') as HTMLElement,
    number: document.querySelector('#preview-number') as HTMLElement,
    date: document.querySelector('#preview-date') as HTMLElement
  },
  inputs: {
    name: document.querySelector('#name') as HTMLInputElement,
    cvc: document.querySelector('#cvc') as HTMLInputElement,
    number: document.querySelector('#card-number') as HTMLInputElement,
    expMonth: document.querySelector('#exp-month') as HTMLInputElement,
    expYear: document.querySelector('#exp-year') as HTMLInputElement
  }
};

const errorMessages = {
  required: "Can't be blank",
  pattern: 'Wrong format, numbers only'
} as const;

const getErrorElement = (el: HTMLElement): HTMLElement => {
  const next = el.nextElementSibling as HTMLElement;
  if (next?.dataset.error) return next;
  return getErrorElement(next);
};

domElements.form?.addEventListener('submit', e => {
  e.preventDefault();
  const target = e.target as HTMLFormElement;

  const fields = target.querySelectorAll('input');
  let isValid = true;

  fields.forEach(field => {
    const validity = (field as HTMLInputElement).validity;
    const errorElement = getErrorElement(field);

    if (validity.valid) {
      field.classList.remove('error');
      errorElement.textContent = '';
      return;
    }

    console.log(field.name, validity);
    isValid = false;
    field.classList.add('error');
    errorElement.textContent = validity.valueMissing
      ? errorMessages.required
      : errorMessages.pattern;
  });

  if (isValid) {
    domElements.form?.classList.add('hidden');
    domElements.success?.classList.remove('hidden');
  }
});

const updatePreview = () => {
  domElements.preview.name.textContent =
    domElements.inputs.name.value || 'Jane Appleseeds';
  domElements.preview.number.textContent =
    domElements.inputs.number.value || '0000 0000 0000 0000';
  domElements.preview.cvc.textContent = domElements.inputs.cvc.value || '000';
  domElements.preview.date.textContent = `${
    domElements.inputs.expMonth.value || '00'
  }/${domElements.inputs.expYear.value || '00'}`;
};

domElements.reset?.addEventListener('click', () => {
  domElements.form?.classList.remove('hidden');
  domElements.success?.classList.add('hidden');
  domElements.form?.reset();
});

domElements.form?.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', updatePreview);
});
