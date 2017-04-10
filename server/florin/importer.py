import csv


class CSVImporter(object):
    def _import(self, file_storage, transaction_class):
        result = []
        reader = csv.DictReader(file_storage)
        for line in reader:
            attrs = {}
            for key, (csv_key, transform_fn) in transaction_class.MAPPING.items():
                if isinstance(csv_key, str):
                    csv_keys = [csv_key]
                else:
                    csv_keys = csv_key

                for csv_key in csv_keys:
                    if csv_key in line:
                        break

                attrs[key] = transform_fn(line[csv_key])
            result.append(transaction_class(**attrs))

    def import_from(self, file_storage):
        self._import(file_storage)


def get_importer(filename):
    if filename.lower().endswith('csv'):
        return CSVImporter()
    return None
