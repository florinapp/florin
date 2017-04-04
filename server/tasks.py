from invoke import task


@task
def build(ctx):
    ctx.run('docker build -t florin-server .', pty=True)


@task
def run_image(ctx):
    ctx.run('docker run -p 9000:9000 florin-server')


@task
def clean(ctx):
    ctx.run('rm florin.sqlite')


@task
def run(ctx):
    ctx.run('gunicorn --access-logfile=- --error-logfile=- --timeout=9999 -b 0.0.0.0:9000 --reload florin.app:app',
            pty=True)
