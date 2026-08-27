"""Debounced frontend SEO rebuild after property/news changes."""

from __future__ import annotations

import logging
import subprocess
import threading
from pathlib import Path

logger = logging.getLogger(__name__)

REPO_ROOT = Path(__file__).resolve().parents[2]
REBUILD_SCRIPT = REPO_ROOT / 'deploy' / 'rebuild-frontend-seo.sh'
DEBOUNCE_SECONDS = 90

_lock = threading.Lock()
_timer: threading.Timer | None = None


def schedule_seo_rebuild() -> None:
    """Queue a single rebuild; resets the timer if called again within the debounce window."""
    global _timer

    if not REBUILD_SCRIPT.is_file():
        logger.warning('SEO rebuild script missing: %s', REBUILD_SCRIPT)
        return

    with _lock:
        if _timer is not None:
            _timer.cancel()
        _timer = threading.Timer(DEBOUNCE_SECONDS, _run_rebuild)
        _timer.daemon = True
        _timer.start()


def _run_rebuild() -> None:
    logger.info('Starting debounced frontend SEO rebuild')
    try:
        subprocess.Popen(
            ['bash', str(REBUILD_SCRIPT)],
            cwd=str(REPO_ROOT),
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True,
        )
    except OSError as exc:
        logger.exception('Failed to start SEO rebuild: %s', exc)
