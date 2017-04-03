from invoke import task


@task
def clean(ctx):
    ctx.run('rm florin.sqlite')


@task
def run(ctx):
    ctx.run('gunicorn --access-logfile=- --error-logfile=- --timeout=9999 -b 0.0.0.0:9000 --reload florin.app:app',
            pty=True)
