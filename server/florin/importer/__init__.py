from .csv import CSVImporter
from .ofx import OFXImporter


def get_importer(filename):
    if filename.lower().endswith('csv'):
        return CSVImporter()
    if filename.lower().endswith('ofx'):
        return OFXImporter()
    return None
