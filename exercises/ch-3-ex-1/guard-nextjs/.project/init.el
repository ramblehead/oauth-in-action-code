;; -*- coding: utf-8 -*-

(defvar artizanya-guard-nextjs-lint-buffer-name
  "*@artizanya/guard-nextjs-lint*")

(defvar artizanya-guard-nextjs-make-buffer-name
  "*@artizanya/guard-nextjs-make*")

(defvar artizanya-guard-nextjs-dev-buffer-name
  "*@artizanya/guard-nextjs-dev*")

(defvar artizanya-guard-nextjs-build-buffer-name
  "*@artizanya/guard-nextjs-build*")

(defun artizanya-guard-nextjs-lint ()
  (interactive)
  (rh-project-compile
   "lint"
   artizanya-guard-nextjs-lint-buffer-name))

;; (defun artizanya-guard-nextjs-make ()
;;   (interactive)
;;   (rh-project-compile
;;    "make"
;;    artizanya-guard-nextjs-make-buffer-name))

;; (defun artizanya-guard-nextjs-clean ()
;;   (interactive)
;;   (rh-project-compile
;;    "clean"
;;    artizanya-guard-nextjs-make-buffer-name))

(defun artizanya-guard-nextjs-dev ()
  (interactive)
  (rh-project-compile
   "dev"
   artizanya-guard-nextjs-dev-buffer-name))

(defun artizanya-guard-nextjs-build ()
  (interactive)
  (rh-project-compile
   "build"
   artizanya-guard-nextjs-build-buffer-name))

;; (defun artizanya-guard-nextjs-kill ()
;;   (interactive)
;;   (rh-project-kill-shell-process
;;    artizanya-guard-nextjs-dev-buffer-name))

(defun artizanya-guard-nextjs-hydra-define ()
  (defhydra artizanya-guard-nextjs-hydra (:color blue :columns 5)
    "@artizanya/guard-nextjs project commands"
    ("l" artizanya-guard-nextjs-lint
     "lint")
    ;; ("b" artizanya-guard-nextjs-make
    ;;  "make")
    ;; ("c" artizanya-guard-nextjs-clean
    ;;  "clean")
    ("d" artizanya-guard-nextjs-dev
     "dev")
    ("b" artizanya-guard-nextjs-build
     "build")
    ;; ("R" artizanya-guard-nextjs-kill
    ;;  "kill")
    ))

(artizanya-guard-nextjs-hydra-define)

(define-minor-mode artizanya-guard-nextjs-mode
  "artizanya-guard-nextjs-mode project-specific minor mode."
  :lighter " artizanya-guard-nextjs"
  :keymap (let ((map (make-sparse-keymap)))
            (define-key map (kbd "<f9>") #'artizanya-guard-nextjs-hydra/body)
            map))

(add-to-list 'rm-blacklist " artizanya-guard-nextjs")

(defun artizanya-guard-nextjs-setup ()
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
