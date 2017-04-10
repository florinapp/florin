from invoke import task


@task
def new_migration(ctx, m):
    ctx.run('yoyo new ./migrations -m "{}"'.format(m), pty=True)


@task
def migrate(ctx):
    ctx.run('yoyo apply --database sqlite:///florin.sqlite ./migrations', echo=True, pty=True)


@task
def build(ctx):
    ctx.run('docker build -t florin-server .', pty=True)


@task
def run_image(ctx):
    ctx.run('docker run -d -v $(pwd)/florin.sqlite:/app/florin.sqlite -p 9000:9000 florin-server')


@task
def clean(ctx):
    ctx.run('rm florin.sqlite')


@task
def run(ctx):
    # TODO: change to os.execvp
    ctx.run('DBFILE=florin.sqlite '
            'gunicorn --access-logfile=- --error-logfile=- --timeout=9999 -b 0.0.0.0:9000 --reload florin.app:app',
            pty=True)


@task
def lint(ctx):
    ctx.run('flake8 --max-line-length=120 florin')
