"""
==========================================================
AtmoSync AI - Configuration Package
==========================================================

This package centralizes all project configurations and
business rules used throughout the AtmoSync AI system.

Modules
-------
config.py
    Stores project settings, folder paths, constants,
    IoT simulation parameters, and dataset configuration.

business_rules.py
    Stores business logic including risk thresholds,
    spoilage rules, financial rules, and dashboard colors.

Author:
    Sujan Pradhan

Project:
    AtmoSync AI
    Smart Cold Chain Monitoring & Spoilage Risk Analytics System
"""

# Import all configuration settings
from .config import *

# Import all business rules
from .business_rules import *

# Package Version
__version__ = "1.0.0"

# Package Author
__author__ = "Sujan Pradhan"

# Package Name
PACKAGE_NAME = "AtmoSync AI"

# Public objects exported from this package
__all__ = [
    name
    for name in globals()
    if not name.startswith("_")
]