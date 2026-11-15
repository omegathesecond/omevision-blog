# Blog native build test discovery repair

Incident: incident-ce7fe7035f0bb852d39f43ce

The latest trigger build at investigation was a978e712-cdda-4080-9ee6-3609762747a3,
trigger 4eb9dce2-c1e7-480c-877b-79e55488982f, commit
3016db2477fc1f7bee333a4c35781cb68f9234b8. It failed before publication:
Node rejected shell-expanded relative test paths under node_modules. Reproduced
in node:22 with the original command and identical error.

The release:test automation now discovers installed guard suites and resolves
absolute filenames before invoking Node. Empty discovery and subprocess errors
fail loudly. The regression executes two dependency suites, confirms their side
effect, and proves a failing suite produces a nonzero result. Existing source,
artifact, environment and provider publication guards remain mandatory.

Validation: node:22 container, no network, npm run release:test && npm run build:
launcher regression 1 passed; installed guard tests 26 passed; release wiring
poisoned source/environment/artifact checks passed; Vite production build and
postbuild guard passed. Receipt /tmp/ce7-node22.log SHA256:
ba228bb8d7009dc5b3769ae06d6662fbc1170c6ba0d3f4a1f8ca84f9963edc96.
The expected failing fixture is nested inside the passing launcher regression.

Fix ledger GET product=omevision contained no existing blog build repair.
Cloudflare canonical production deployment f16b9e15-fe7f-42c6-9bcd-030993407217
was successful, commit 41cf642a0642b256e90b8728558cb42a6ec8d88b.
Independent host-network GETs of https://omevision-blog.pages.dev and the
configured autoblogger /api/blogs?company=eneza&limit=1 both returned 200.
blog.omevision.com is not a configured Pages domain.

Review/deploy follow-up: merge into repository master through the normal pipeline;
Cloud Build publishes to Pages production branch main. Do not confuse those two
branch names. Verify exact pushed/merged commit, successful newer trigger build,
and Cloudflare canonical production deployment commit separately. Retest Pages
HTML, its referenced JS/CSS assets, and the configured published-post list/detail
API operations. PATCH the incident verifyCmd with read-only assertions for this
released commit and workflow before deployment completion; attach the final live
retest to the company_operating_lesson. This implementation receipt does not
claim a repaired production deployment. No bindings or service minima changed.
