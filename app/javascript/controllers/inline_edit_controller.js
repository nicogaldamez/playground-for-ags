import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "input" ]
  
  connect() {
    this.originalText = this.inputTarget.value
    this.inputTarget.focus()
    this.inputTarget.select()
  }

  submitForm() {
    if (this.inputTarget.disabled) return

    this.element.requestSubmit()
    this.inputTarget.disabled = true
  }

  abort() {
    this.inputTarget.value = this.originalText
    this.submitForm()
  }
}
