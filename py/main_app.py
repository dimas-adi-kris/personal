import sys
import random
from PySide6 import QtCore, QtWidgets, QtGui
class MyWidget(QtWidgets.QWidget):
    def __init__(self):
        super().__init__()

        # self.hello = ["Hallo Welt", "Hei maailma", "Hola Mundo", "Привет мир"]

        self.button = QtWidgets.QPushButton("Click me!")
        self.button_link = QtWidgets.QPushButton("Open link!")
        self.text = QtWidgets.QLabel("Don't forget to update your finances!", alignment=QtCore.Qt.AlignCenter)
        self.layout = QtWidgets.QVBoxLayout(self)

        self.layout.addWidget(self.text)
        self.layout.addWidget(self.button_link)
        self.layout.addWidget(self.button)

        self.button_link.clicked.connect(self.open_link)

    @QtCore.Slot()
    def magic(self):
        self.text.setText(random.choice(self.hello))
        
    @QtCore.Slot()
    def open_link(self):
        QtGui.QDesktopServices.openUrl("https://program-db-334c5.web.app/#!/")
if __name__ == "__main__":
    app = QtWidgets.QApplication([])

    widget = MyWidget()
    widget.resize(800, 600)
    widget.show()

    sys.exit(app.exec())