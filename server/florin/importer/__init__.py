from .csv import CSVImporter


def get_importer(filename):
    if filename.lower().endswith('csv'):
        return CSVImporter()
    return None
