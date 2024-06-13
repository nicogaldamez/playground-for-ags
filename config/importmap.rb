# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "trix"
pin "@rails/actiontext", to: "actiontext.esm.js"
pin "@thoughtbot/trix-mentions-element", to: "@thoughtbot--trix-mentions-element.js" # @0.1.2
pin "@github/combobox-nav", to: "@github--combobox-nav.js" # @2.3.1
