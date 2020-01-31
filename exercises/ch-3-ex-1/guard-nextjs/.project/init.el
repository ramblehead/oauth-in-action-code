;; -*- coding: utf-8 -*-

(require 'hydra)

(defvar oauthia-guard-nextjs-lint-buffer-name
  "*@oauth/guard-nextjs-lint*")

(defvar oauthia-guard-nextjs-run-buffer-name
  "*@oauth/guard-nextjs-run*")

(defvar oauthia-guard-nextjs-build-buffer-name
  "*@oauth/guard-nextjs-build*")

(defun oauthia-guard-nextjs-lint ()
  (interactive)
  (rh-project-compile
   "lint"
   oauthia-guard-nextjs-lint-buffer-name))

(defun oauthia-guard-nextjs-build ()
  (interactive)
  (rh-project-compile
   "build"
   oauthia-guard-nextjs-build-buffer-name))

(defun oauthia-guard-nextjs-dev ()
  (interactive)
  (rh-project-restart-shell-command
   "dev"
   oauthia-guard-nextjs-run-buffer-name))

(defun oauthia-guard-nextjs-start ()
  (interactive)
  (rh-project-restart-shell-command
   "start"
   oauthia-guard-nextjs-run-buffer-name))

(defun oauthia-guard-nextjs-stop ()
  (interactive)
  (rh-project-kill-shell-process
   oauthia-guard-nextjs-run-buffer-name))

(defun oauthia-guard-nextjs-hydra-define ()
  (defhydra oauthia-guard-nextjs-hydra (:color blue :columns 5)
    "@oauthia/ch-3-ex1-client/guard-nextjs project commands"
    ("l" oauthia-guard-nextjs-lint
     "lint")
    ("b" oauthia-guard-nextjs-build
     "build")
    ("d" oauthia-guard-nextjs-dev
     "dev")
    ("s" oauthia-guard-nextjs-start
     "start")
    ("S" oauthia-guard-nextjs-stop
     "stop")))

(oauthia-guard-nextjs-hydra-define)

(define-minor-mode oauthia-guard-nextjs-mode
  "oauthia-guard-nextjs-mode project-specific minor mode."
  :lighter " oauthia-guard-nextjs"
  :keymap (let ((map (make-sparse-keymap)))
            (define-key map (kbd "<f9>") #'oauthia-guard-nextjs-hydra/body)
            map))

(add-to-list 'rm-blacklist " oauthia-guard-nextjs")

(defun oauthia-guard-nextjs-setup ()
  (let ((project-root (rh-project-get-root))
        file-rpath ext-js)
    (when project-root
      (setq file-rpath (abbreviate-file-name
                        (expand-file-name buffer-file-name project-root)))

      (cond
       ((string-match-p "\\.ts\\'\\|\\.tsx\\'" file-rpath)
        (setq-local tide-tsserver-executable
                    (concat project-root "node_modules/.bin/tsserver"))
        (setq-local flycheck-javascript-eslint-executable
                    (concat project-root "node_modules/.bin/eslint"))
        (rh-setup-typescript-tide))

       ((or (string-match-p "^#!.*node" (save-excursion
                                          (goto-char (point-min))
                                          (thing-at-point 'line t)))
            (setq ext-js (string-match-p "\\.js\\'" file-rpath)))
        ;; tsserver requires non-.ts files to be manually added to the files
        ;; array in tsconfig.json, otherwise the file will be loaded as part
        ;; of an 'inferred project'. This won't be necessary anymore after
        ;; TypeScript allows defining custom file
        ;; extensions. https://github.com/Microsoft/TypeScript/issues/8328
        (unless ext-js (setq tide-require-manual-setup t))
        (setq rh-js2-additional-externs
              (append rh-js2-additional-externs '("require" "exports" "module")))
        (setq-local tide-tsserver-executable
                    (concat project-root "node_modules/.bin/tsserver"))
        (setq-local flycheck-javascript-eslint-executable
                    (concat project-root "node_modules/.bin/eslint"))
        (rh-setup-javascript-tide))))))
