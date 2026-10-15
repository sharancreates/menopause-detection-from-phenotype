"""
MenoPhenotype self-assessment scoring CLI entrypoint.
Backward-compatible forwarder to menophenotype.inference.assess.
"""

from menophenotype.inference import assess, main
from menophenotype.schemas import SYMP_COLS

__all__ = ["assess", "SYMP_COLS"]

if __name__ == "__main__":
    main()
